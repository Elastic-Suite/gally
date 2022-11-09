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

namespace Elasticsuite\Search\Service\GraphQl;

use Elasticsuite\GraphQl\Decoration\Serializer\SerializerContextBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;

class FilterManager
{
    public function __construct(
        private FieldFilterInputType $fieldFilterInputType,
    ) {
    }

    public function validateFilters(array $context): void
    {
        $errors = [];
        if (!isset($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'])) {
            return;
        }

        foreach ($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'] as $argName => $filter) {
            $errors = array_merge($errors, $this->fieldFilterInputType->validate('filter', [$argName => $filter]));
        }

        !\count($errors) ?: throw new \InvalidArgumentException(implode(', ', $errors));
    }

    public function getFiltersFromContext(array $context): array
    {
        $filters = $context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'] ?? [];

        if (isset($context['filters']['currentCategoryId'])) {
            $filters[]['category__id'] = ['eq' => $context['filters']['currentCategoryId']];
        }

        return $filters;
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
                $esFilters[] = $this->fieldFilterInputType->transformToElasticsuiteFilter(
                    [$sourceFieldName => $condition],
                    $containerConfig,
                    $filterContext
                );
            }
        }

        return $esFilters;
    }
}
