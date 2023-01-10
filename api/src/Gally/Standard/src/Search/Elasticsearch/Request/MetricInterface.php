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

namespace Gally\Search\Elasticsearch\Request;

/**
 * Interface for metrics.
 */
interface MetricInterface extends AggregationInterface
{
    /**
     * Available metric types.
     */
    public const TYPE_AVG = 'avgMetric';
    public const TYPE_MIN = 'minMetric';
    public const TYPE_MAX = 'maxMetric';
    public const TYPE_SUM = 'sumMetric';
    public const TYPE_STATS = 'statsMetric';
    public const TYPE_EXTENDED_STATS = 'extendedStatsMetric';
    public const TYPE_CARDINALITY = 'cardinalityMetric';
    public const TYPE_PERCENTILES = 'percentilesMetric';
    public const TYPE_TOP_HITS = 'topHitsMetric';

    /**
     * Metric field.
     */
    public function getField(): string;

    /**
     * Metric extra config.
     */
    public function getConfig(): array;
}
