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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\RequestInterface;

// use Elasticsuite\Search\Adapter\Elasticsearch\Request\SortOrder\Assembler as SortOrderAssembler;
// use Elasticsuite\Search\Adapter\Elasticsearch\Request\Aggregation\Assembler as AggregationAssembler;

/**
 * Map a search request into an ES Search query.
 */
class Mapper
{
    private QueryAssembler $queryAssembler;

    // private SortOrderAssembler $sortOrderAssembler;

    // private AggregationAssembler $aggregationAssembler;

    /**
     * Constructor.
     * TODO support $sortOrderAssembler and $aggregationAssembler.
     *
     * @param QueryAssembler $queryAssembler Adapter query assembler
     *
     * -param SortOrderAssembler   $sortOrderAssembler   Adapter sort orders assembler
     * -param AggregationAssembler $aggregationAssembler Adapter aggregations assembler
     */
    public function __construct(
        QueryAssembler $queryAssembler/* ,
        SortOrderAssembler $sortOrderAssembler,
        AggregationAssembler $aggregationAssembler */
    ) {
        $this->queryAssembler = $queryAssembler;
        /*
        $this->sortOrderAssembler   = $sortOrderAssembler;
        $this->aggregationAssembler = $aggregationAssembler;
        */
    }

    /**
     * Transform the search request into an ES request.
     *
     * @param RequestInterface $request Search Request
     */
    public function assembleSearchRequest(RequestInterface $request): array
    {
        $searchRequest = [
            'size' => $request->getSize(),
        ];

        if ($searchRequest['size'] > 0) {
            $searchRequest['sort'] = $this->getSortOrders($request);
            $searchRequest['from'] = $request->getFrom();
        }

        $query = $this->getRootQuery($request);
        if ($query) {
            $searchRequest['query'] = $query;
        }

        /*
        $filter = $this->getRootFilter($request);
        if ($filter) {
            $searchRequest['post_filter'] = $filter;
        }
        */

        /*
        $aggregations = $this->getAggregations($request);
        if (!empty($aggregations)) {
            $searchRequest['aggregations'] = $aggregations;
        }
        */

        $searchRequest['track_total_hits'] = $request->getTrackTotalHits();

        return $searchRequest;
    }

    /**
     * Extract and assemble the root query of the search request.
     *
     * @param RequestInterface $request Search request
     */
    private function getRootQuery(RequestInterface $request): array
    {
        return $this->queryAssembler->assembleQuery($request->getQuery());
    }

    /*
     * Extract and assemble the root filter of the search request.
     *
     * @param RequestInterface $request Search request
     */
    /*
    private function getRootFilter(RequestInterface $request): array
    {
        $filter = null;

        if ($request->getFilter()) {
            $filter = $this->queryAssembler->assembleQuery($request->getFilter());
        }

        return $filter;
    }
    */

    /**
     * Extract and assemble sort orders of the search request.
     *
     * @param RequestInterface $request Search request
     */
    private function getSortOrders(RequestInterface $request): array
    {
        return $sortOrders = [];
        /*
        if ($request->getSortOrders()) {
            $sortOrders = $this->sortOrderAssembler->assembleSortOrders($request->getSortOrders());
        }

        return $sortOrders;
        */
    }

    /*
     * Extract and assemble aggregations of the search request.
     *
     * @param RequestInterface $request Search request
     */
    /*
    private function getAggregations(RequestInterface $request): array
    {
        $aggregations = [];

        if ($request->getAggregation()) {
            $aggregations = $this->aggregationAssembler->assembleAggregations($request->getAggregation());
        }

        return $aggregations;
    }
    */
}
