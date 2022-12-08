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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket;

use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

class MultiTerms extends Terms
{
    private array $fields;

    /**
     * Constructor.
     *
     * @param string                 $name              Bucket name
     * @param string                 $field             Bucket main field
     * @param string[]               $additionalFields  Bucket additional fields
     * @param AggregationInterface[] $childAggregations Child aggregations
     * @param ?string                $nestedPath        Nested path for nested bucket
     * @param ?QueryInterface        $filter            Bucket filter
     * @param ?QueryInterface        $nestedFilter      Nested filter for the bucket
     * @param int                    $size              Bucket size
     * @param string|string[]        $sortOrder         Bucket sort order
     * @param string[]               $include           Include bucket filter
     * @param string[]               $exclude           Exclude bucket filter
     * @param ?int                   $minDocCount       Min doc count bucket filter
     */
    public function __construct(
        string $name,
        string $field,
        array $additionalFields,
        array $childAggregations = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null,
        int $size = 0,
        string|array $sortOrder = BucketInterface::SORT_ORDER_COUNT,
        array $include = [],
        array $exclude = [],
        ?int $minDocCount = null
    ) {
        parent::__construct(
            $name,
            $field,
            $childAggregations,
            $nestedPath,
            $filter,
            $nestedFilter,
            $size,
            $sortOrder,
            $include,
            $exclude,
            $minDocCount
        );

        // We put the "value" field after the "label" field in order to keep sort by key working for multi-terms.
        $this->fields = array_merge($additionalFields, [$field]);
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_MULTI_TERMS;
    }

    /**
     * Get the multi-terms bucket fields.
     *
     * @return string[]
     */
    public function getFields(): array
    {
        return $this->fields;
    }
}
