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
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;

/**
 * Assemble Es Reverse nested aggregation.
 */
class ReverseNested implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (BucketInterface::TYPE_REVERSE_NESTED !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid aggregation type {$aggregation->getType()}.");
        }

        return ['reverse_nested' => new \StdClass()];
    }
}
