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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;

class BucketValue implements BucketValueInterface
{
    /**
     * @param mixed                  $key
     * @param int                    $count
     * @param AggregationInterface[] $childAggregation
     */
    public function __construct(
        private mixed $key,
        private int $count,
        private array $childAggregation,
    ) {
    }

    public function getKey(): mixed
    {
        return $this->key;
    }

    public function getCount(): int
    {
        return $this->count;
    }

    public function getChildAggregation(): iterable
    {
        return $this->childAggregation;
    }
}
