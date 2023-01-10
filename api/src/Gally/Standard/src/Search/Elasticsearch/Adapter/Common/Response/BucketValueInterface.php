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

namespace Gally\Search\Elasticsearch\Adapter\Common\Response;

interface BucketValueInterface
{
    /**
     * Get bucket value key.
     */
    public function getKey(): mixed;

    /**
     * Get count of documents that match this bucket.
     */
    public function getCount(): int;

    /**
     * Get child aggregation of this bucket.
     *
     * @return AggregationInterface[]
     */
    public function getChildAggregation(): iterable;
}
