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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\Aggregation;

use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\AggregationFactory;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Builder for aggregation part of the search request.
 */
class AggregationBuilder
{
    /**
     * Constructor.
     *
     * @param AggregationFactory $aggregationFactory factory used to instantiate buckets
     * @param FilterQueryBuilder $queryBuilder       factory used to create queries inside filtered or nested aggs
     */
    public function __construct(
        private AggregationFactory $aggregationFactory,
        private FilterQueryBuilder $queryBuilder
    ) {
    }

    /**
     * Build the list of buckets from the mapping.
     *
     * @param ContainerConfigurationInterface $containerConfig  Search request configuration
     * @param array                           $aggregationsData facet definitions
     * @param array                           $filters          facet filters to be added to aggregations
     *
     * @return AggregationInterface[]
     */
    public function buildAggregations(ContainerConfigurationInterface $containerConfig, array $aggregationsData, array $filters): array
    {
        $aggregations = [];

        foreach ($aggregationsData as $aggParams) {
            $aggregations[] = \is_object($aggParams) ? $aggParams : $this->buildAggregation($containerConfig, $filters, $aggParams);
        }

        return array_filter($aggregations);
    }

    /**
     * Build a single aggregation.
     *
     * @param ContainerConfigurationInterface $containerConfig   Search request configuration
     * @param array                           $filters           facet filters to be added to aggregations
     * @param array                           $aggregationParams facet definition
     */
    private function buildAggregation(ContainerConfigurationInterface $containerConfig, array $filters, array $aggregationParams): AggregationInterface
    {
        $aggregationType = $aggregationParams['type'];
        $fieldName = $aggregationParams['field'] ?? $aggregationParams['name'];
        $logicalOperator = FieldInterface::FILTER_LOGICAL_OPERATOR_OR;

        try {
            $field = $containerConfig->getMapping()->getField($fieldName);
            $aggregationParams['field'] = $field->getMappingProperty('untouched');

            $additionalFields = [];
            foreach ($aggregationParams['additionalFields'] ?? [] as $additionalFieldName) {
                $additionalField = $containerConfig->getMapping()->getField($additionalFieldName);
                $additionalFields[] = $additionalField->getMappingProperty('untouched');
            }
            $aggregationParams['additionalFields'] = $additionalFields;

            if ($field->isNested()
                && (!isset($aggregationParams['unsetNestedPath'])
                    || false === filter_var($aggregationParams['unsetNestedPath'], \FILTER_VALIDATE_BOOLEAN)
                )
            ) {
                $aggregationParams['nestedPath'] = $field->getNestedPath();
            } elseif (isset($aggregationParams['nestedPath'])) {
                unset($aggregationParams['nestedPath']);
            }

            $logicalOperator = $field->getFilterLogicalOperator();
        } catch (\Exception $e) {
            $aggregationParams['field'] = $fieldName;
        }

        // Merge container/aggregation defined aggregation filters with global request filters.
        $filters = array_merge($filters, $aggregationParams['filters'] ?? []);
        unset($aggregationParams['filters']);

        // Ensure any globally applied (attribute layered navigation) filter is NOT applied on the (most likely) originating agg.
        $bucketFilters = array_diff_key($filters, [$fieldName => true]);
        if (FieldInterface::FILTER_LOGICAL_OPERATOR_AND === $logicalOperator) {
            $bucketFilters = $filters;
        }

        if (!empty($bucketFilters)) {
            $aggregationParams['filter'] = $this->createFilter($containerConfig, $bucketFilters);
        }

        if (isset($aggregationParams['childAggregations'])) {
            $aggregationParams['childAggregations'] = $this->buildAggregations($containerConfig, $aggregationParams['childAggregations'], []);
        }

        if (isset($aggregationParams['nestedFilter'])) {
            $nestedFilter = $this->createFilter($containerConfig, $aggregationParams['nestedFilter'], $aggregationParams['nestedPath']);
            $aggregationParams['nestedFilter'] = $nestedFilter;
        }

        return $this->aggregationFactory->create($aggregationType, $aggregationParams);
    }

    /**
     * Create a QueryInterface for a filter using the query builder.
     *
     * @param ContainerConfigurationInterface $containerConfig Search container configuration
     * @param array                           $filters         filters definition
     * @param string|null                     $currentPath     current nested path or null
     */
    private function createFilter(ContainerConfigurationInterface $containerConfig, array $filters, ?string $currentPath = null): QueryInterface
    {
        return $this->queryBuilder->create($containerConfig, $filters, $currentPath);
    }
}
