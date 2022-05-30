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

namespace Elasticsuite\Search\Elasticsearch\Request;

/**
 * Interface for pipeline aggregations.
 */
interface PipelineInterface extends AggregationInterface
{
    /**
     * Available pipeline types.
     */
    public const TYPE_BUCKET_SELECTOR = 'bucketSelectorPipeline';
    public const TYPE_MOVING_FUNCTION = 'movingFunctionPipeline';
    public const TYPE_MAX_BUCKET = 'maxBucketPipeline';

    /**
     * Available gap policies.
     */
    public const GAP_POLICY_SKIP = 'skip';
    public const GAP_POLICY_INSERT_ZEROS = 'insert_zeros';

    /**
     * Get (optional) pipeline buckets path.
     */
    public function getBucketsPath(): array|string|null;

    /**
     * Check if pipeline has buckets path.
     */
    public function hasBucketsPath(): bool;
}
