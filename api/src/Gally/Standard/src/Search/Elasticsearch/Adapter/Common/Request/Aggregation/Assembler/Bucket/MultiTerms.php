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
use Gally\Search\Elasticsearch\Request\Aggregation\Bucket\MultiTerms as MultiTermBucket;
use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Assemble an ES MultiTerms aggregation.
 */
class MultiTerms implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (BucketInterface::TYPE_MULTI_TERMS !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid aggregation type {$aggregation->getType()}.");
        }

        /** @var MultiTermBucket $aggregation */
        $aggregationEs = ['multi_terms' => ['terms' => [], 'size' => $aggregation->getSize()]];

        $terms = [];
        foreach ($aggregation->getFields() as $field) {
            $terms[] = [
                'field' => $field,
                'missing' => 'None',
            ];
        }
        $aggregationEs['multi_terms']['terms'] = $terms;

        if (\is_array($aggregation->getSortOrder())) {
            $aggregationEs['multi_terms']['order'] = $aggregation->getSortOrder();
        } elseif (\in_array($aggregation->getSortOrder(), [$aggregation::SORT_ORDER_COUNT, $aggregation::SORT_ORDER_MANUAL], true)) {
            $aggregationEs['multi_terms']['order'] = [$aggregation::SORT_ORDER_COUNT => SortOrderInterface::SORT_DESC];
        } elseif ($aggregation->getSortOrder() == $aggregation::SORT_ORDER_TERM) {
            $aggregationEs['multi_terms']['order'] = [$aggregation::SORT_ORDER_TERM => SortOrderInterface::SORT_ASC];
        } elseif ($aggregation->getSortOrder() == $aggregation::SORT_ORDER_RELEVANCE && !$aggregation->isNested()) {
            $aggregationEs['aggregations']['termRelevance'] = ['avg' => ['script' => $aggregation::SORT_ORDER_RELEVANCE]];
            $aggregationEs['multi_terms']['order'] = ['termRelevance' => SortOrderInterface::SORT_DESC];
        }

        return $aggregationEs;
    }
}
