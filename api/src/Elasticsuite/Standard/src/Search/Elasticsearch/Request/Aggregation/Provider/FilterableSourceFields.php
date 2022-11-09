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

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\ConfigResolver\FieldAggregationConfigResolverInterface;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier\ModifierInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\AggregationProviderInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;

/**
 * Default Aggregations Provider for Search Requests.
 */
class FilterableSourceFields implements AggregationProviderInterface
{
    /**
     * @param SourceFieldRepository                     $sourceFieldRepository source field repository
     * @param FieldAggregationConfigResolverInterface[] $aggregationResolvers  attributes Aggregation Resolver Pool
     * @param ModifierInterface[]                       $modifiersPool         product Attributes modifiers
     */
    public function __construct(
        private SourceFieldRepository $sourceFieldRepository,
        private iterable $aggregationResolvers,
        private iterable $modifiersPool = []
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfiguration,
        $query = null,
        $filters = [],
        $queryFilters = []
    ): array {
        $filterableField = $this->sourceFieldRepository->getFilterableInAggregationFields(
            $containerConfiguration->getMetadata()->getEntity()
        );

        foreach ($this->modifiersPool as $modifier) {
            $filterableField = $modifier->modifySourceFields(
                $containerConfiguration->getMetadata(),
                $containerConfiguration->getLocalizedCatalog(),
                $filterableField,
                $query,
                $filters,
                $queryFilters
            );
        }

        $aggregations = $this->getAggregationsConfig($filterableField);

        foreach ($this->modifiersPool as $modifier) {
            $aggregations = $modifier->modifyAggregations(
                $containerConfiguration->getMetadata(),
                $containerConfiguration->getLocalizedCatalog(),
                $aggregations,
                $query,
                $filters,
                $queryFilters
            );
        }

        return $aggregations;
    }

    /**
     * Get aggregations config.
     *
     * @param SourceField[] $sourceFields the source fields
     */
    private function getAggregationsConfig(array $sourceFields): array
    {
        $aggregations = [];

        foreach ($sourceFields as $sourceField) {
            $aggregationConfig = $this->getAggregationConfig($sourceField);
            if (!empty($aggregationConfig) && isset($aggregationConfig['name'])) {
                $aggregations[$aggregationConfig['name']] = $aggregationConfig;
            }
        }

        return $aggregations;
    }

    private function getAggregationConfig(SourceField $sourceField): array
    {
        foreach ($this->aggregationResolvers as $aggregationResolver) {
            if ($aggregationResolver->supports($sourceField)) {
                return $aggregationResolver->getConfig($sourceField);
            }
        }

        return [
            'name' => $sourceField->getCode(),
            'type' => BucketInterface::TYPE_TERMS,
        ];
    }
}
