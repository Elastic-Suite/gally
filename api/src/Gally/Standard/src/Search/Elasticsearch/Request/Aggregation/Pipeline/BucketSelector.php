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

namespace Gally\Search\Elasticsearch\Request\Aggregation\Pipeline;

/**
 * BucketSelector pipeline.
 */
class BucketSelector extends AbstractPipeline
{
    /**
     * BucketSelector constructor.
     *
     * @param string            $name        Pipeline name
     * @param array|string|null $bucketsPath Pipeline buckets path
     * @param string            $script      Pipeline script
     * @param string            $gapPolicy   Pipeline gap policy
     */
    public function __construct(
        string $name,
        array|string|null $bucketsPath,
        private string $script,
        private string $gapPolicy = self::GAP_POLICY_SKIP
    ) {
        parent::__construct($name, $bucketsPath);
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
