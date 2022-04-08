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
 * Historgram bucket implementation.
 *
 * @category Smile
 *
 * @author   Aurelien FOUCRET <aurelien.foucret@smile.fr>
 */
class Histogram extends AbstractBucket
{
    private int|string $interval;

    private int $minDocCount;

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
     * @param int|string          $interval     Histogram interval
     * @param int                 $minDocCount  Histogram min doc count
     */
    public function __construct(
        string $name,
        string $field,
        array $metrics = [],
        array $childBuckets = [],
        array $pipelines = [],
        ?string $nestedPath = null,
        QueryInterface $filter = null,
        QueryInterface $nestedFilter = null,
        int|string $interval = 1,
        int $minDocCount = 0
    ) {
        parent::__construct($name, $field, $metrics, $childBuckets, $pipelines, $nestedPath, $filter, $nestedFilter);
        $this->interval = $interval;
        $this->minDocCount = $minDocCount;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_HISTOGRAM;
    }

    /**
     * Histogram interval.
     */
    public function getInterval(): int|string
    {
        return $this->interval;
    }

    /**
     * Histograms min doc count.
     */
    public function getMinDocCount(): int
    {
        return $this->minDocCount;
    }
}
