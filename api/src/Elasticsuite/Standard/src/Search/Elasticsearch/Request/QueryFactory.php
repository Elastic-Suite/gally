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
 * Factory for search request queries.
 */
class QueryFactory
{
    private array $factories;

    /**
     * Constructor.
     *
     * @param iterable $factories Query factories by type
     */
    public function __construct(iterable $factories = [])
    {
        $factories = ($factories instanceof \Traversable) ? iterator_to_array($factories) : $factories;

        $this->factories = $factories;
    }

    /**
     * Create a query from its type and params.
     *
     * @param string $queryType   Query type (must be a valid query type defined into the factories array)
     * @param array  $queryParams Query constructor params
     */
    public function create(string $queryType, array $queryParams = []): QueryInterface
    {
        if (!isset($this->factories[$queryType])) {
            throw new \LogicException("No factory found for query of type {$queryType}");
        }

        return $this->factories[$queryType]->create($queryParams);
    }
}
