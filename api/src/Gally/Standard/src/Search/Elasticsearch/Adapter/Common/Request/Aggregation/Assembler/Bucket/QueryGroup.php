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

namespace Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Gally\Search\Elasticsearch\Adapter\Common\Request\Query;
use Gally\Search\Elasticsearch\Request\Aggregation\Bucket\QueryGroup as QueryGroupBucket;
use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\BucketInterface;

/**
 * Assemble an ES filters aggregation.
 */
class QueryGroup implements AssemblerInterface
{
    public function __construct(private Query\Assembler $queryAssembler)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (BucketInterface::TYPE_QUERY_GROUP !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid aggregation type {$aggregation->getType()}.");
        }

        /** @var QueryGroupBucket $aggregation */
        $filters = [];

        foreach ($aggregation->getQueries() as $value => $query) {
            $filters[$value] = $this->queryAssembler->assembleQuery($query);
        }

        return ['filters' => ['filters' => $filters]];
    }
}
