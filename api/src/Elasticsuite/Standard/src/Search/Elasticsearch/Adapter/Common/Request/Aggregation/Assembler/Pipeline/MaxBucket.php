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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline\MaxBucket as MaxBucketPipeline;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;

/**
 * Assemble a max bucket selector ES pipeline aggregation.
 *
 * @category Smile
 */
class MaxBucket implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (PipelineInterface::TYPE_MAX_BUCKET !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid pipeline type {$aggregation->getType()}.");
        }

        /** @var MaxBucketPipeline $aggregation */
        $aggParams = [
            'buckets_path' => $aggregation->getBucketsPath(),
            'format' => $aggregation->getFormat(),
            'gap_policy' => $aggregation->getGapPolicy(),
        ];

        return ['max_bucket' => $aggParams];
    }
}
