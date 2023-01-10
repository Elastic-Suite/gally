<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Search\Elasticsearch\Request\Aggregation\Bucket;

use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;

/**
 * Date histogram bucket implementation.
 */
class DateHistogram extends Histogram
{
    /**
     * Constructor.
     *
     * @param string                 $name              Bucket name
     * @param string                 $field             Bucket field
     * @param AggregationInterface[] $childAggregations Child aggregations
     * @param ?string                $nestedPath        Nested path for nested bucket
     * @param ?QueryInterface        $filter            Bucket filter
     * @param ?QueryInterface        $nestedFilter      Nested filter for the bucket
     * @param int|string             $interval          Histogram interval
     * @param int                    $minDocCount       Histogram min doc count
     */
    public function __construct(
        string $name,
        string $field,
        array $childAggregations = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null,
        int|string $interval = '1d',
        int $minDocCount = 0
    ) {
        parent::__construct(
            $name,
            $field,
            $childAggregations,
            $nestedPath,
            $filter,
            $nestedFilter,
            $interval,
            $minDocCount
        );
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_DATE_HISTOGRAM;
    }
}
