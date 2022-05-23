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
 * Interface for metrics.
 */
interface MetricInterface
{
    /**
     * Available metric types.
     */
    public const TYPE_AVG = 'avg';
    public const TYPE_MIN = 'min';
    public const TYPE_MAX = 'max';
    public const TYPE_SUM = 'sum';
    public const TYPE_STATS = 'stats';
    public const TYPE_EXTENDED_STATS = 'extended_stats';
    public const TYPE_CARDINALITY = 'cardinality';
    public const TYPE_PERCENTILES = 'percentiles';

    /**
     * Metric type.
     */
    public function getType(): string;

    /**
     * Metric field.
     */
    public function getField(): string;

    /**
     * Metric name.
     */
    public function getName(): string;

    /**
     * Metric extra config.
     *
     * @return array<mixed>
     */
    public function getConfig(): array;
}
