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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket;

use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Significant term bucket implementation.
 */
class SignificantTerms extends AbstractBucket
{
    public const ALGORITHM_GND = 'gnd';

    public const ALGORITHM_CHI_SQUARE = 'chi_square';

    public const ALGORITHM_JLH = 'jlh';

    public const ALGORITHM_PERCENTAGE = 'percentage';

    /**
     * Constructor.
     *
     * @param string                 $name              Bucket name
     * @param string                 $field             Bucket field
     * @param AggregationInterface[] $childAggregations Child aggregations
     * @param ?string                $nestedPath        Nested path for nested bucket
     * @param ?QueryInterface        $filter            Bucket filter
     * @param ?QueryInterface        $nestedFilter      Nested filter for the bucket
     * @param int                    $size              Bucket size
     * @param int                    $minDocCount       Min doc count
     * @param string                 $algorithm         Algorithm used
     */
    public function __construct(
        string $name,
        string $field,
        array $childAggregations = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null,
        private int $size = 0,
        private int $minDocCount = 5,
        private string $algorithm = self::ALGORITHM_GND
    ) {
        parent::__construct($name, $field, $childAggregations, $nestedPath, $filter, $nestedFilter);

        $this->size = $size > 0 && $size < self::MAX_BUCKET_SIZE ? $size : self::MAX_BUCKET_SIZE;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_SIGNIFICANT_TERMS;
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
