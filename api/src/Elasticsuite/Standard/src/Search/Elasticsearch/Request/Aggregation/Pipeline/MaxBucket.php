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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline;

/**
 * MaxBucket pipeline.
 */
class MaxBucket extends AbstractPipeline
{
    /**
     * MaxBucket constructor.
     *
     * @param string            $name        Pipeline name
     * @param array|string|null $bucketsPath Pipeline buckets path
     * @param string            $gapPolicy   Pipeline gap policy
     * @param string            $format      Pipeline format
     */
    public function __construct(
        string $name,
        array|string|null $bucketsPath,
        private string $gapPolicy = self::GAP_POLICY_SKIP,
        private string $format = ''
    ) {
        parent::__construct($name, $bucketsPath);
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return self::TYPE_MAX_BUCKET;
    }

    /**
     * Get pipeline format.
     */
    public function getFormat(): string
    {
        return $this->format;
    }

    /**
     * Get pipeline gap policy.
     */
    public function getGapPolicy(): string
    {
        return $this->gapPolicy;
    }
}
