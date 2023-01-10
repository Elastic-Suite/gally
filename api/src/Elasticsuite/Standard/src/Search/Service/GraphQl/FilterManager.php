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

namespace Elasticsuite\Search\Service\GraphQl;

use Elasticsuite\GraphQl\Decoration\Serializer\SerializerContextBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;

class FilterManager
{
    public function __construct(
        private FieldFilterInputType $fieldFilterInputType,
        protected string $nestingSeparator,
    ) {
    }

    public function validateFilters(array $context, ContainerConfigurationInterface $containerConfiguration): void
    {
        $errors = [];
        if (!isset($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'])) {
            return;
        }

        foreach ($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'] as $argName => $filter) {
            $errors = array_merge($errors, $this->fieldFilterInputType->validate('filter', [$argName => $filter], $containerConfiguration));
        }

        !\count($errors) ?: throw new \InvalidArgumentException(implode(', ', $errors));
    }

    public function getFiltersFromContext(array $context): array
    {
        return $context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'] ?? [];
    }

    public function getQueryFilterFromContext(array $context): array
    {
        return [];
    }

    /**
     * Transform GraphQL filters in understandable Elasticsuite filters.
     *
     * @param array $graphQlFilters context
     */
    public function transformToElasticsuiteFilters(array $graphQlFilters, ContainerConfigurationInterface $containerConfig, array $filterContext = []): array
    {
        $esFilters = [];
        foreach ($graphQlFilters as $filters) {
            foreach ($filters as $sourceFieldName => $condition) {
                if (str_contains($sourceFieldName, '.')) {
                    // Api platform automatically replace nesting separator by '.',
                    // but it keeps the value with nesting separator. In order to avoid applying
                    // the filter twice, we have to skip the one with the '.'.
                    continue;
                }
                $esFilterData = $this->fieldFilterInputType->transformToElasticsuiteFilter(
                    [$sourceFieldName => $condition],
                    $containerConfig,
                    $filterContext
                );
                if ('boolFilter' == $sourceFieldName) {
                    $esFilters[] = $esFilterData;
                } else {
                    $esFilters[str_replace($this->nestingSeparator, '.', $sourceFieldName)] = $esFilterData;
                }
            }
        }

        return $esFilters;
    }
}
