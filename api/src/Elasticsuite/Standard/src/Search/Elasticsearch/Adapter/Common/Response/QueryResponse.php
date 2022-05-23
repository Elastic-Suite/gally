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

use Elasticsuite\Search\Elasticsearch\ResponseInterface;

// use Elasticsuite\Search\Adapter\Elasticsearch\Response\AggregationFactory;
// use Elasticsuite\Search\Adapter\Elasticsearch\Response\MetricFactory;

class QueryResponse implements ResponseInterface
{
    /**
     * Document collection.
     *
     * @var Document[]
     */
    protected array $documents = [];

    /**
     * Documents count.
     */
    protected int $count = 0;

    /**
     * Aggregations collection.
     */
    protected array $aggregations;

    /**
     * Metrics collection.
     */
    protected array $metrics;

    /**
     * Constructor.
     *
     * @param array $searchResponse Engine raw response
     */
    public function __construct(
        // DocumentFactory $documentFactory,
        // AggregationFactory $aggregationFactory,
        // MetricFactory $metricFactory,
        array $searchResponse
    ) {
        $this->prepareDocuments($searchResponse);
        // $this->prepareAggregations($searchResponse, $aggregationFactory);
        // $this->prepareMetrics($searchResponse, $metricFactory);
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

    /**
     * Build document list from the engine raw search response.
     *
     * @param array $searchResponse Engine raw search response
     *
     * @return void
     */
    private function prepareDocuments(array $searchResponse)
    {
        $this->documents = [];

        if (isset($searchResponse['hits'])) {
            $hits = $searchResponse['hits']['hits'];

            foreach ($hits as $hit) {
                $this->documents[] = new Document($hit);
            }

            $this->count = \is_array($searchResponse['hits']['total'])
                ? $searchResponse['hits']['total']['value']
                : $searchResponse['hits']['total'];
        }
    }
}
