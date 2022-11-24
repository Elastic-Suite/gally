<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Provider;

use Elasticsuite\Product\Service\CurrentCategoryProvider;
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

        $aggregations = $this->getAggregationsConfig($facetConfigs);

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
    private function getAggregationsConfig(array $facetConfigs): array
    {
        $aggregations = [];

        foreach ($facetConfigs as $facetConfig) {
            $aggregationConfig = $this->getAggregationConfig($facetConfig);
            if (!empty($aggregationConfig) && isset($aggregationConfig['name'])) {
                $aggregations[$aggregationConfig['name']] = $aggregationConfig;
            }
        }

        return $aggregations;
    }

    private function getAggregationConfig(Configuration $facetConfig): array
    {
        $config = [
            'name' => $facetConfig->getSourceField()->getCode(),
            'type' => BucketInterface::TYPE_TERMS,
        ];

        foreach ($this->aggregationResolvers as $aggregationResolver) {
            if ($aggregationResolver->supports($facetConfig->getSourceField())) {
                $config = $aggregationResolver->getConfig($facetConfig->getSourceField());
                break;
            }
        }

        $config['size'] = $facetConfig->getMaxSize();

        return $config;
    }
}
