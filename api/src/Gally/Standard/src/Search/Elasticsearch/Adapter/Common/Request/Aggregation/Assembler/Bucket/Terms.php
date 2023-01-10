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
use Gally\Search\Elasticsearch\Request\Aggregation\Bucket\Terms as TermsBucket;
use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;

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
