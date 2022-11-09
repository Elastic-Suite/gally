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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request;

use Elasticsuite\Search\Elasticsearch\Builder\Request\Aggregation\AggregationBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\SortOrderBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Elasticsuite\Search\Elasticsearch\RequestInterface;
use Elasticsuite\Search\Elasticsearch\Spellchecker;
use Elasticsuite\Search\Elasticsearch\SpellcheckerInterface;

/**
 * ElasticSuite search requests builder.
 */
class RequestBuilder
{
    /**
     * Constructor.
     *
     * @param RequestFactoryInterface              $requestFactory           Factory used to build the request
     * @param QueryBuilder                         $queryBuilder             Builder for the query part of the request
     * @param SortOrderBuilder                     $sortOrderBuilder         Builder for the sort order(s) part of the request
     * @param AggregationBuilder                   $aggregationBuilder       Builder for the aggregation part of the request
     * @param Spellchecker\RequestFactoryInterface $spellcheckRequestFactory Spellchecker request factory
     * @param SpellcheckerInterface                $spellchecker             Spellchecker Spellchecker
     */
    public function __construct(
        private RequestFactoryInterface $requestFactory,
        private QueryBuilder $queryBuilder,
        private SortOrderBuilder $sortOrderBuilder,
        private AggregationBuilder $aggregationBuilder,
        private Spellchecker\RequestFactoryInterface $spellcheckRequestFactory,
        private SpellcheckerInterface $spellchecker,
    ) {
    }

    /**
     * Create a new search request.
     *
     * @param ContainerConfigurationInterface $containerConfig search container configuration
     * @param int                             $from            Search request pagination from clause
     * @param int                             $size            Search request pagination size
     * @param string|QueryInterface|null      $query           Search request query
     * @param array                           $sortOrders      Search request sort orders
     * @param array                           $filters         Search request filters
     * @param QueryInterface[]                $queryFilters    Search request filters prebuilt as QueryInterface
     * @param array|null                      $facets          Search request facets
     */
    public function create(
        ContainerConfigurationInterface $containerConfig,
        int $from,
        int $size,
        string|QueryInterface|null $query = null,
        array $sortOrders = [],
        array $filters = [],
        array $queryFilters = [],
        ?array $facets = []
    ): RequestInterface {
        $facetFilters = array_intersect_key($filters, $facets ?? []);
        $facets = \is_array($facets)
            ? array_merge($facets, $containerConfig->getAggregations($query, $filters, $queryFilters))
            : [];

        /*
        $queryFilters = array_merge($queryFilters, $containerFilters, array_diff_key($filters, $facetFilters));
        */

        $spellingType = SpellcheckerInterface::SPELLING_TYPE_EXACT;

        if ($query && \is_string($query)) {
            $spellingType = $this->getSpellingType($containerConfig, $query);
        }

        $requestParams = [
            'name' => $containerConfig->getName(),
            'indexName' => $containerConfig->getIndexName(),
            'from' => $from,
            'size' => $size,
            'query' => $this->queryBuilder->createQuery($containerConfig, $query, $queryFilters, $spellingType),
            'sortOrders' => $this->sortOrderBuilder->buildSortOrders($containerConfig, $sortOrders),
            'aggregations' => $this->aggregationBuilder->buildAggregations($containerConfig, $facets, $facetFilters),
            'spellingType' => $spellingType,
            'trackTotalHits' => $containerConfig->getTrackTotalHits(),
        ];

        /*
        if (!empty($facetFilters)) {
            $requestParams['filter'] = $this->queryBuilder->createFilterQuery($containerConfig, $facetFilters);
        }
        */

        return $this->requestFactory->create($requestParams);
    }

    /*
     * Returns search request applied to each request for a given search container.
     *
     * @param ContainerConfigurationInterface $containerConfig Search request configuration
     *
     * @return \Smile\ElasticsuiteCore\Search\Request\QueryInterface[]
     */
    /*
    private function getContainerFilters(ContainerConfigurationInterface $containerConfig)
    {
        return $containerConfig->getFilters();
    }
    */

    /*
     * Returns aggregations configured in the search container.
     *
     * @param ContainerConfigurationInterface $containerConfig Search request configuration
     * @param string|QueryInterface           $query           Search Query
     * @param array                           $filters         Search request filters
     * @param QueryInterface[]                $queryFilters    Search request filters prebuilt as QueryInterface
     *
     * @return array
     */
    /*
    private function getContainerAggregations(ContainerConfigurationInterface $containerConfig, $query, $filters, $queryFilters)
    {
        return $this->aggregationResolver->getContainerAggregations($containerConfig, $query, $filters, $queryFilters);
    }
    */

    /*
     * Retrieve the spelling type for a fulltext query.
     *
     * @param ContainerConfigurationInterface $containerConfig Search request configuration
     * @param string|string[]                 $queryText       Query text
     */
    private function getSpellingType(ContainerConfigurationInterface $containerConfig, string $queryText): int
    {
        $spellcheckRequestParams = [
            'index' => $containerConfig->getIndexName(),
            'queryText' => $queryText,
            'cutoffFrequency' => $containerConfig->getRelevanceConfig()->getCutOffFrequency(),
        ];

        $spellcheckRequest = $this->spellcheckRequestFactory->create($spellcheckRequestParams);

        return $this->spellchecker->getSpellingType($spellcheckRequest);
    }

    /*
     * Load the search request configuration (index, type, mapping, ...) using the search request container name.
     *
     * @param int    $catalogId     Catalog id
     * @param string $containerName Search request container name
     *
     * @throws \LogicException Thrown when the search container is not found into the configuration
     */
    /*private function getRequestContainerConfiguration(int $catalogId, string $containerName): ContainerConfigurationInterface
    {
        if (null === $containerName) {
            throw new \LogicException('Request name is not set');
        }

        return $this->containerConfigFactory->create(
            ['containerName' => $containerName, 'catalogId' => $catalogId]
        );

        if (null === $config) {
            throw new \LogicException("No configuration exists for request {$containerName}");
        }

        return $config;
    }*/
}
