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
 * Query group aggregations.
 */
class QueryGroup extends AbstractBucket
{
    /**
     * @var QueryInterface[]
     */
    private array $queries;

    /**
     * Constructor.
     *
     * @param string              $name         Bucket name
     * @param QueryInterface[]    $queries      Query group children queries
     * @param MetricInterface[]   $metrics      Bucket metrics
     * @param BucketInterface[]   $childBuckets Child buckets
     * @param PipelineInterface[] $pipelines    Bucket pipelines
     * @param ?string             $nestedPath   Nested path for nested bucket
     * @param ?QueryInterface     $filter       Bucket filter
     * @param ?QueryInterface     $nestedFilter Nested filter for the bucket
     */
    public function __construct(
        string $name,
        array $queries,
        array $metrics = [],
        array $childBuckets = [],
        array $pipelines = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null
    ) {
        parent::__construct($name, $name, $metrics, $childBuckets, $pipelines, $nestedPath, $filter, $nestedFilter);
        $this->queries = $queries;
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
