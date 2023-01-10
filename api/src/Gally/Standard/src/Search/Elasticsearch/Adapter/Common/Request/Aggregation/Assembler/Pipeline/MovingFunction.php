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

namespace Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Gally\Search\Elasticsearch\Request\Aggregation\Pipeline\MovingFunction as MovingFunctionPipeline;
use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\PipelineInterface;

/**
 * "Moving Function" pipeline aggregation assembler.
 */
class MovingFunction implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (PipelineInterface::TYPE_MOVING_FUNCTION !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid pipeline type {$aggregation->getType()}.");
        }

        /** @var MovingFunctionPipeline $aggregation */
        $aggParams = [
            'buckets_path' => $aggregation->getBucketsPath(),
            'script' => $aggregation->getScript(),
            'gap_policy' => $aggregation->getGapPolicy(),
            'window' => $aggregation->getWindow(),
        ];

        return ['moving_fn' => $aggParams];
    }
}
