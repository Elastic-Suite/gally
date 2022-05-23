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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline;

/**
 * BucketSelector pipeline.
 */
class BucketSelector extends AbstractPipeline
{
    private string $script;

    private string $gapPolicy;

    /**
     * BucketSelector constructor.
     *
     * @param string                   $name        Pipeline name
     * @param array<mixed>|string|null $bucketsPath Pipeline buckets path
     * @param string                   $script      Pipeline script
     * @param string                   $gapPolicy   Pipeline gap policy
     */
    public function __construct(
        string $name,
        array|string|null $bucketsPath,
        string $script,
        string $gapPolicy = self::GAP_POLICY_SKIP
    ) {
        parent::__construct($name, $bucketsPath);
        $this->script = $script;
        $this->gapPolicy = $gapPolicy;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return self::TYPE_BUCKET_SELECTOR;
    }

    /**
     * Get pipeline script.
     */
    public function getScript(): string
    {
        return $this->script;
    }

    /**
     * Get pipeline gap policy.
     */
    public function getGapPolicy(): string
    {
        return $this->gapPolicy;
    }
}
