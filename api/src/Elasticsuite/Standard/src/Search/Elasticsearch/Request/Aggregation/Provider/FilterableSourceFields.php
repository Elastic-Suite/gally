<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Provider;

use Elasticsuite\Category\Service\CurrentCategoryProvider;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\ConfigResolver\FieldAggregationConfigResolverInterface;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier\ModifierInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Facet\Configuration;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

/**
 * Aggregations Provider based on source fields.
 */
class FilterableSourceFields implements AggregationProviderInterface
{
    /**
     * @param ConfigurationRepository                   $facetConfigRepository   facet configuration repository
     * @param CurrentCategoryProvider                   $currentCategoryProvider current category provider
     * @param FieldAggregationConfigResolverInterface[] $aggregationResolvers    attributes Aggregation Resolver Pool
     * @param ModifierInterface[]                       $modifiersPool           product Attributes modifiers
     */
    public function __construct(
        private ConfigurationRepository $facetConfigRepository,
        private CurrentCategoryProvider $currentCategoryProvider,
        private iterable $aggregationResolvers,
        private iterable $modifiersPool = []
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfig,
        $query = null,
        $filters = [],
        $queryFilters = []
    ): array {
        $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
        $this->facetConfigRepository->setCategoryId($currentCategory?->getId());
        $this->facetConfigRepository->setMetadata($containerConfig->getMetadata());
        $facetConfigs = $this->facetConfigRepository->findAll();

        foreach ($this->modifiersPool as $modifier) {
            $facetConfigs = $modifier->modifyFacetConfigs($containerConfig, $facetConfigs, $query, $filters, $queryFilters);
        }

        $aggregations = $this->getAggregationsConfig($containerConfig, $facetConfigs);

        foreach ($this->modifiersPool as $modifier) {
            $aggregations = $modifier->modifyAggregations($containerConfig, $aggregations, $query, $filters, $queryFilters);
        }

        return $aggregations;
    }

    /**
     * Get aggregations config.
     *
     * @param Configuration[] $facetConfigs the source fields facet configuration
     */
    private function getAggregationsConfig(ContainerConfigurationInterface $containerConfig, array $facetConfigs): array
    {
        $aggregations = [];

        foreach ($facetConfigs as $facetConfig) {
            $aggregationConfig = $this->getAggregationConfig($facetConfig, $containerConfig);
            if (!empty($aggregationConfig) && isset($aggregationConfig['name'])) {
                $aggregations[$aggregationConfig['name']] = $aggregationConfig;
            }
        }

        return $aggregations;
    }

    private function getAggregationConfig(Configuration $facetConfig, ContainerConfigurationInterface $containerConfig): array
    {
        $config = [
            'name' => $facetConfig->getSourceField()->getCode(),
            'type' => BucketInterface::TYPE_TERMS,
        ];

        foreach ($this->aggregationResolvers as $aggregationResolver) {
            if ($aggregationResolver->supports($facetConfig)) {
                $config = $aggregationResolver->getConfig($containerConfig, $facetConfig);
                break;
            }
        }

        $config['sortOrder'] = $facetConfig->getSortOrder();
        $config['size'] = BucketInterface::SORT_ORDER_MANUAL == $facetConfig->getSortOrder()
            ? 0
            : $facetConfig->getMaxSize();

        return $config;
    }
}
