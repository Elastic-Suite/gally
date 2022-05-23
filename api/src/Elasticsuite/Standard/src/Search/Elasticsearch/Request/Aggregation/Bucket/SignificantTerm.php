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
 * Significant term bucket implementation.
 */
class SignificantTerm extends AbstractBucket
{
    public const ALGORITHM_GND = 'gnd';

    public const ALGORITHM_CHI_SQUARE = 'chi_square';

    public const ALGORITHM_JLH = 'jlh';

    public const ALGORITHM_PERCENTAGE = 'percentage';

    private int $size;

    private int $minDocCount;

    private string $algorithm;

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
     * @param int                 $size         Bucket size
     * @param int                 $minDocCount  Min doc count
     * @param string              $algorithm    Algorithm used
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
        int $minDocCount = 5,
        string $algorithm = self::ALGORITHM_GND
    ) {
        parent::__construct($name, $field, $metrics, $childBuckets, $pipelines, $nestedPath, $filter, $nestedFilter);

        $this->minDocCount = $minDocCount;
        $this->algorithm = $algorithm;
        $this->size = $size > 0 && $size < self::MAX_BUCKET_SIZE ? $size : self::MAX_BUCKET_SIZE;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_SIGNIFICANT_TERM;
    }

    /**
     * Bucket size.
     */
    public function getSize(): int
    {
        return $this->size;
    }

    /**
     * Min doc count for a value to be displayed.
     */
    public function getMinDocCount(): int
    {
        return $this->minDocCount;
    }

    /**
     * Algorithm used for the value selection.
     */
    public function getAlgorithm(): string
    {
        return $this->algorithm;
    }
}
