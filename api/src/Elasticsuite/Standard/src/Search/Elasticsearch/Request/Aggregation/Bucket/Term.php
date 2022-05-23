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
 * Term Bucket implementation.
 */
class Term extends AbstractBucket
{
    private int $size;

    private string $sortOrder;

    /**
     * @var string[]
     */
    private array $include;

    /**
     * @var string[]
     */
    private array $exclude;

    /**
     * @var int
     */
    private ?int $minDocCount;

    /**
     * Constructor.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     *
     * @param string              $name         Bucket name
     * @param string              $field        Bucket field
     * @param MetricInterface[]   $metrics      Bucket metrics
     * @param BucketInterface[]   $childBuckets Child buckets
     * @param PipelineInterface[] $pipelines    Bucket pipelines
     * @param ?string             $nestedPath   Nested path for nested bucket
     * @param ?QueryInterface     $filter       Bucket filter
     * @param ?QueryInterface     $nestedFilter Nested filter for the bucket
     * @param int                 $size         Nucket size
     * @param string              $sortOrder    Nucket sort order
     * @param string[]            $include      Include bucket filter
     * @param string[]            $exclude      Exclude bucket filter
     * @param ?int                $minDocCount  Min doc count bucket filter
     */
    public function __construct(
        string $name,
        string $field,
        array $metrics = [],
        array $childBuckets = [],
        array $pipelines = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null,
        int $size = 0,
        string $sortOrder = BucketInterface::SORT_ORDER_COUNT,
        array $include = [],
        array $exclude = [],
        ?int $minDocCount = null
    ) {
        parent::__construct($name, $field, $metrics, $childBuckets, $pipelines, $nestedPath, $filter, $nestedFilter);

        $this->size = $size > 0 && $size < self::MAX_BUCKET_SIZE ? $size : self::MAX_BUCKET_SIZE;
        $this->sortOrder = $sortOrder;
        $this->include = $include;
        $this->exclude = $exclude;
        $this->minDocCount = $minDocCount;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_TERM;
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

    /**
     * Bucket include filter.
     *
     * @return string[]
     */
    public function getInclude(): array
    {
        return $this->include;
    }

    /**
     * Bucket exclude filter.
     *
     * @return string[]
     */
    public function getExclude(): array
    {
        return $this->exclude;
    }

    /**
     * Bucket min doc count filter.
     */
    public function getMinDocCount(): ?int
    {
        return $this->minDocCount;
    }
}
