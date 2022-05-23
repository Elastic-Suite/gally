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

use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Elasticsuite\Search\Elasticsearch\RequestInterface;
use Elasticsuite\Search\Elasticsearch\SpellcheckerInterface;

class SimpleRequestBuilder
{
    private QueryBuilder $queryBuilder;

    // private SortOrderBuilder $sortOrderBuilder;

    // private AggregationBuilder $aggregationBuilder;

    private RequestFactoryInterface $requestFactory;

    // private SpellcheckRequestFactory $spellcheckRequestFactory;

    // private SpellcheckerInterface $spellchecker;

    // private AggregationResolverInterface $aggregationResolver;

    /**
     * Constructor.
     * TODO add support for $sortOrderBuilder, $aggregationBuilder, $spellcheckRequestFactory, $spellchecker
     * and $aggregationResolver.
     *
     * @param RequestFactoryInterface $requestFactory Factory used to build the request
     * @param QueryBuilder            $queryBuilder   Builder for the query part of the request
     */
    public function __construct(
        RequestFactoryInterface $requestFactory,
        QueryBuilder $queryBuilder,
        /*
        SortOrderBuilder $sortOrderBuilder,
        AggregationBuilder $aggregationBuilder,
        SpellcheckRequestFactory $spellcheckRequestFactory,
        SpellcheckerInterface $spellchecker,
        AggregationResolverInterface $aggregationResolver
        */
    ) {
        $this->requestFactory = $requestFactory;
        $this->queryBuilder = $queryBuilder;
        // $this->sortOrderBuilder = $sortOrderBuilder;
        // $this->aggregationBuilder = $aggregationBuilder;
        // $this->spellcheckRequestFactory = $spellcheckRequestFactory;
        // $this->spellchecker = $spellchecker;
        // $this->aggregationResolver = $aggregationResolver;
    }

    /**
     * Create a new search request.
     *
     * @param string                     $indexName    Target index name
     * @param int                        $from         Search request pagination from clause
     * @param int                        $size         Search request pagination size
     * @param string|QueryInterface|null $query        Search request query
     * @param array                      $sortOrders   Search request sort orders
     * @param array                      $filters      Search request filters
     * @param QueryInterface[]           $queryFilters Search request filters prebuilt as QueryInterface
     * @param array                      $facets       Search request facets
     */
    public function create(
        string $indexName,
        int $from,
        int $size,
        string|QueryInterface|null $query = null,
        array $sortOrders = [],
        array $filters = [],
        array $queryFilters = [],
        array $facets = []
    ): RequestInterface {
        /*
        $facetFilters = array_intersect_key($filters, $facets);
        $queryFilters = array_merge($queryFilters, array_diff_key($filters, $facetFilters));
        */

        $spellingType = SpellcheckerInterface::SPELLING_TYPE_EXACT;
        /*
        if ($query && is_string($query)) {
            $spellingType = $this->getSpellingType($containerConfig, $query);
        }
        */

        $requestParams = [
            'name' => 'raw',
            'indexName' => $indexName,
            'from' => $from,
            'size' => $size,
            // 'query'        => $this->queryBuilder->createQuery($containerConfig, $query, $queryFilters, $spellingType),
            'query' => $this->queryBuilder->createQuery($query),
            // 'sortOrders'   => $this->sortOrderBuilder->buildSordOrders($containerConfig, $sortOrders),
            // 'buckets'      => $this->aggregationBuilder->buildAggregations($containerConfig, $facets, $facetFilters),
            'spellingType' => $spellingType,
            // 'trackTotalHits' => $containerConfig->getTrackTotalHits(),
        ];

        /*
        if (!empty($facetFilters)) {
            $requestParams['filter'] = $this->queryBuilder->createFilterQuery($containerConfig, $facetFilters);
        }
        */

        return $this->requestFactory->create($requestParams);
    }
}
