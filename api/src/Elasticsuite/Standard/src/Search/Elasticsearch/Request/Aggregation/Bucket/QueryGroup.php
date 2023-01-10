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
 * Query group aggregations.
 */
class QueryGroup extends AbstractBucket
{
    /**
     * Constructor.
     *
     * @param string                 $name              Bucket name
     * @param QueryInterface[]       $queries           Query group children queries
     * @param AggregationInterface[] $childAggregations Child aggregations
     * @param ?string                $nestedPath        Nested path for nested bucket
     * @param ?QueryInterface        $filter            Bucket filter
     * @param ?QueryInterface        $nestedFilter      Nested filter for the bucket
     */
    public function __construct(
        string $name,
        private array $queries,
        array $childAggregations = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null
    ) {
        parent::__construct($name, $name, $childAggregations, $nestedPath, $filter, $nestedFilter);
    }

    /**
     * {@inheritDoc}
     */
    public function getField(): string
    {
        throw new \LogicException('getField is not supported on query group aggregations.');
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return BucketInterface::TYPE_QUERY_GROUP;
    }

    /**
     * List of the queries of the query group.
     *
     * @return QueryInterface[]
     */
    public function getQueries(): array
    {
        return $this->queries;
    }
}
