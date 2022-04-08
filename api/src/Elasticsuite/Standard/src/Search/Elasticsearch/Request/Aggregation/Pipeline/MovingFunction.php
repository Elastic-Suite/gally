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

use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;

/**
 * "Moving Function" pipeline :
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline-movfn-aggregation.html.
 */
class MovingFunction extends AbstractPipeline
{
    private string $script;

    private string $gapPolicy;

    private int $window;

    /**
     * MovingFunction constructor.
     *
     * @param string                   $name        Pipeline name
     * @param array<mixed>|string|null $bucketsPath Pipeline buckets path
     * @param string                   $script      Pipeline script
     * @param int                      $window      Pipeline window
     * @param string                   $gapPolicy   Pipeline gap policy
     */
    public function __construct(
        string $name,
        array|string|null $bucketsPath,
        string $script,
        int $window = 10,
        string $gapPolicy = self::GAP_POLICY_SKIP
    ) {
        parent::__construct($name, $bucketsPath);
        $this->script = $script;
        $this->gapPolicy = $gapPolicy;
        $this->window = $window;
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
