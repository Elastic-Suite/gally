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
 * Factory for search request aggregations.
 */
class AggregationFactory
{
    private array $factories;

    /**
     * Constructor.
     *
     * @param iterable $factories Aggregation factories by type
     */
    public function __construct(iterable $factories = [])
    {
        $factories = ($factories instanceof \Traversable) ? iterator_to_array($factories) : $factories;

        $this->factories = $factories;
    }

    /**
     * Create an aggregation from its type and params.
     *
     * @param string $aggregationType   Aggregation type (must be a valid aggregation type defined into the factories array)
     * @param array  $aggregationParams Aggregation constructor params
     */
    public function create(string $aggregationType, array $aggregationParams = []): AggregationInterface
    {
        if (!isset($this->factories[$aggregationType])) {
            throw new \LogicException("No factory found for aggregation of type {$aggregationType}");
        }

        return $this->factories[$aggregationType]->create($aggregationParams);
    }
}
