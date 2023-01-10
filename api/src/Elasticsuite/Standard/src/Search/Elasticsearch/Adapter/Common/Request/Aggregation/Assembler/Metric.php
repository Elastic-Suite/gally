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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\MetricInterface;

/**
 * Assemble ES metric aggregation.
 */
class Metric implements AssemblerInterface
{
    private array $esTypeMapping = [
        MetricInterface::TYPE_AVG => 'avg',
        MetricInterface::TYPE_CARDINALITY => 'cardinality',
        MetricInterface::TYPE_EXTENDED_STATS => 'extended_stats',
        MetricInterface::TYPE_MAX => 'max',
        MetricInterface::TYPE_MIN => 'min',
        MetricInterface::TYPE_PERCENTILES => 'percentiles',
        MetricInterface::TYPE_STATS => 'stats',
        MetricInterface::TYPE_SUM => 'sum',
    ];

    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (!$aggregation instanceof MetricInterface || !\array_key_exists($aggregation->getType(), $this->esTypeMapping)) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid metric type {$aggregation->getType()}.");
        }

        $metricDefinition = array_merge(['field' => $aggregation->getField()], $aggregation->getConfig());
        if (isset($metricDefinition['script'])) {
            unset($metricDefinition['field']);
        }

        return [$this->esTypeMapping[$aggregation->getType()] => $metricDefinition];
    }
}
