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

use Gally\Search\Elasticsearch\Request\PipelineInterface;

/**
 * "Moving Function" pipeline :
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movfn-aggregation.html.
 */
class MovingFunction extends AbstractPipeline
{
    /**
     * MovingFunction constructor.
     *
     * @param string            $name        Pipeline name
     * @param array|string|null $bucketsPath Pipeline buckets path
     * @param string            $script      Pipeline script
     * @param int               $window      Pipeline window
     * @param string            $gapPolicy   Pipeline gap policy
     */
    public function __construct(
        string $name,
        array|string|null $bucketsPath,
        private string $script,
        private int $window = 10,
        private string $gapPolicy = self::GAP_POLICY_SKIP
    ) {
        parent::__construct($name, $bucketsPath);
    }

    /**
     * Get pipeline script.
     * The script that should be executed on each window of data.
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

    /**
     * Get pipeline window.
     * The size of window to "slide" across the histogram.
     */
    public function getWindow(): int
    {
        return $this->window;
    }

    /**
     * Get pipeline type.
     */
    public function getType(): string
    {
        return PipelineInterface::TYPE_MOVING_FUNCTION;
    }
}
