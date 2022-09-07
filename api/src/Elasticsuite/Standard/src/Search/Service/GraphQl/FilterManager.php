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

    /**
     * Transform GraphQL filters in understandable Elasticsuite filters.
     *
     * @param array $context context
     */
    public function formatFilters(array $context, ContainerConfigurationInterface $containerConfig): array
    {
        $filters = [];
        if (isset($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'])) {
            foreach ($context[SerializerContextBuilder::GRAPHQL_ELASTICSUITE_FILTERS_KEY]['filter'] as $argFilters) {
                foreach ($argFilters as $argName => $filter) {
                    if (str_contains($argName, '.')) {
                        // Api platform automatically replace nesting separator by '.',
                        // but it keeps the value with nesting separator. In order to avoid applying
                        // the filter twice, we have to skip the one with the '.'.
                        continue;
                    }
                    $filters[] = $this->fieldFilterInputType->transformToElasticsuiteFilter(
                        [$argName => $filter],
                        $containerConfig,
                    );
                }
            }
        }

        return $filters;
    }
}
