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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation;

use Elasticsuite\Search\Elasticsearch\Request\MetricInterface;

/**
 * Metrics aggregation.
 */
class Metric implements MetricInterface
{
    /**
     * @param string $name   Bucket name
     * @param string $field  Bucket field
     * @param string $type   Metric type
     * @param array  $config Metric extra config
     */
    public function __construct(
        private string $name,
        private string $field,
        private string $type = MetricInterface::TYPE_STATS,
        private array $config = []
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * {@inheritDoc}
     */
    public function getConfig(): array
    {
        return $this->config;
    }
}
