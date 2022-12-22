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

use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Service\SearchSettingsProvider;

/**
 * Coverage request aggregation resolver.
 * Returns only data we plan to build coverage on (attribute_set_id, indexed_attributes).
 */
class CoverageAggregationProvider implements AggregationProviderInterface
{
    public function __construct(
        private SourceFieldRepository $sourceFieldRepository,
        private QueryFactory $queryFactory,
        private SearchSettingsProvider $searchSettings,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfig,
        QueryInterface|string|null $query = null,
        array $filters = [],
        array $queryFilters = []
    ): array {
        if ($this->searchSettings->coverageUseIndexedFieldsProperty()) {
            return [
                ['name' => 'indexed_fields', 'field' => 'indexed_fields.keyword', 'type' => BucketInterface::TYPE_TERMS, 'size' => 0],
            ];
        }

        $sourceFields = $this->sourceFieldRepository->getFilterableInAggregationFields('product');
        $queries = [];

        foreach ($sourceFields as $sourceField) {
            $query = $this->queryFactory->create(
                QueryInterface::TYPE_EXISTS,
                ['field' => $sourceField->getCode(), 'name' => $sourceField->getCode()]
            );

            if ($sourceField->getNestedPath() || \in_array($sourceField->getType(), Type::COMPLEX_TYPES, true)) {
                $query = $this->queryFactory->create(
                    QueryInterface::TYPE_NESTED,
                    ['path' => $sourceField->getNestedPath() ?: $sourceField->getCode(), 'query' => $query]
                );
            }

            $queries[$sourceField->getCode()] = $query;
        }

        return [
            'indexed_fields' => [
                'name' => 'indexed_fields',
                'type' => BucketInterface::TYPE_QUERY_GROUP,
                'queries' => $queries,
            ],
        ];
    }
}
