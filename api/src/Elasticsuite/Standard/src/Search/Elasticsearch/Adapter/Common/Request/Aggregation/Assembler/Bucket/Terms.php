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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\Terms as TermsBucket;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Assemble an ES Terms aggregation.
 */
class Terms implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (BucketInterface::TYPE_TERMS !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid aggregation type {$aggregation->getType()}.");
        }

        /** @var TermsBucket $aggregation */
        $aggregationEs = ['terms' => ['field' => $aggregation->getField(), 'size' => $aggregation->getSize()]];

        if (\is_array($aggregation->getSortOrder())) {
            $aggregationEs['terms']['order'] = $aggregation->getSortOrder();
        } elseif (\in_array($aggregation->getSortOrder(), [$aggregation::SORT_ORDER_COUNT, $aggregation::SORT_ORDER_MANUAL], true)) {
            $aggregationEs['terms']['order'] = [$aggregation::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC];
        } elseif ($aggregation->getSortOrder() == $aggregation::SORT_ORDER_TERM) {
            $aggregationEs['terms']['order'] = [$aggregation::SORT_ORDER_TERM => SortOrderInterface::SORT_ASC];
        } elseif ($aggregation->getSortOrder() == $aggregation::SORT_ORDER_RELEVANCE && !$aggregation->isNested()) {
            $aggregationEs['aggregations']['termRelevance'] = ['avg' => ['script' => $aggregation::SORT_ORDER_RELEVANCE]];
            $aggregationEs['terms']['order'] = ['termRelevance' => SortOrderInterface::SORT_DESC];
        }

        return $aggregationEs;
    }
}
