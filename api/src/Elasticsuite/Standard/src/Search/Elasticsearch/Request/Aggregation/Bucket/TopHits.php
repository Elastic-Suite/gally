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

use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\MetricInterface;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Top Hits aggregation implementation.
 */
class TopHits extends AbstractBucket
{
    /**
     * @var string[]
     */
    private array $sourceFields;

    private string $sortOrder;

    private int $size;

    /**
     * Constructor.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     *
     * @param string              $name         Bucket name
     * @param string[]            $sourceFields Source fields to fetch from the hits
     * @param int                 $size         Bucket size
     * @param string              $sortOrder    Bucket Sort Order
     * @param MetricInterface[]   $metrics      Bucket metrics
     * @param BucketInterface[]   $childBuckets Child buckets
     * @param PipelineInterface[] $pipelines    Bucket pipelines
     * @param ?string             $nestedPath   Nested path for nested bucket
     * @param ?QueryInterface     $filter       Bucket filter
     * @param ?QueryInterface     $nestedFilter Nested filter for the bucket
     */
    public function __construct(
        string $name,
        array $sourceFields = [],
        int $size = 1,
        string $sortOrder = BucketInterface::SORT_ORDER_COUNT,
        array $metrics = [],
        array $childBuckets = [],
        array $pipelines = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null
    ) {
        parent::__construct($name, $name, $metrics, $childBuckets, $pipelines, $nestedPath, $filter, $nestedFilter);
        $this->sourceFields = $sourceFields;
        $this->sortOrder = $sortOrder;
        $this->size = $size;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_TOP_HITS;
    }

    /**
     * Get source fields to fetch.
     *
     * @return string[]
     */
    public function getSource(): array
    {
        return $this->sourceFields;
    }

    /**
     * Bucket size.
     */
    public function getSize(): int
    {
        return $this->size;
    }

    /**
     * Bucket sort order.
     */
    public function getSortOrder(): string
    {
        return $this->sortOrder;
    }
}
