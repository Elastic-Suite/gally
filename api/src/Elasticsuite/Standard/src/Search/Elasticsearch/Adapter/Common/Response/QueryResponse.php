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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;

use Elasticsuite\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Elasticsuite\Search\Elasticsearch\ResponseInterface;
use Elasticsuite\Search\Model\Document;

class QueryResponse implements ResponseInterface
{
    /**
     * Document collection.
     *
     * @var Document[]
     */
    protected array $documents = [];

    /**
     * Documents count in response.
     */
    protected int $count = 0;

    /**
     * Total documents count.
     */
    protected int $totalItems = 0;

    /**
     * Aggregations collection.
     */
    protected array $aggregations;

    /**
     * Constructor.
     *
     * @param array              $searchResponse     Engine raw response
     * @param AggregationBuilder $aggregationBuilder aggregation builder
     */
    public function __construct(
        array $searchResponse,
        AggregationBuilder $aggregationBuilder
    ) {
        $this->prepareDocuments($searchResponse);
        $this->prepareAggregations($searchResponse, $aggregationBuilder);
    }

    /**
     * {@inheritDoc}
     */
    public function getIterator(): \Traversable
    {
        return new \ArrayIterator($this->documents);
    }

    /**
     * {@inheritDoc}
     */
    public function count(): int
    {
        return $this->count;
    }

    public function getTotalItems(): int
    {
        return $this->totalItems;
    }

    /**
     * {@inheritDoc}
     */
    public function getAggregations(): array
    {
        return $this->aggregations;
    }

    /**
     * Build document list from the engine raw search response.
     *
     * @param array $searchResponse Engine raw search response
     */
    private function prepareDocuments(array $searchResponse): void
    {
        $this->documents = [];
        $this->totalItems = 0;

        if (isset($searchResponse['hits'])) {
            $hits = $searchResponse['hits']['hits'];

            foreach ($hits as $hit) {
                $this->documents[] = new Document($hit);
            }
            $this->count = \count($this->documents);
            $this->totalItems = $searchResponse['hits']['total']['value'] ?? 0;
        }
    }

    /**
     * Build aggregations from the engine raw search response.
     *
     * @param array              $searchResponse     Engine raw search response
     * @param AggregationBuilder $aggregationBuilder aggregation builder
     */
    private function prepareAggregations(array $searchResponse, AggregationBuilder $aggregationBuilder): void
    {
        $this->aggregations = [];
        foreach ($searchResponse['aggregations'] ?? [] as $field => $aggregationData) {
            $aggregation = $aggregationBuilder->create($field, $aggregationData);
            $this->aggregations[$aggregation->getName()] = $aggregation;
        }
    }
}
