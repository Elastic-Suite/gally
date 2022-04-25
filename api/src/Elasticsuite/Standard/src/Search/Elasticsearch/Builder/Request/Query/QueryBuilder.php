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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

// use Elasticsuite\Search\Request\Query\Fulltext\QueryBuilder as FulltextQueryBuilder;
// use Elasticsuite\Search\Request\Query\Filter\QueryBuilder as FilterQueryBuilder;
// use Elasticsuite\Api\Search\Request\ContainerConfigurationInterface;

/**
 * Builder for query part of the search request.
 */
class QueryBuilder
{
    private QueryFactory $queryFactory;

    // private FulltextQueryBuilder $fulltextQueryBuilder;

    // private FilterQueryBuilder $filterQueryBuilder;

    /**
     * Constructor.
     * TODO add support for $fulltextQueryBuilder and $filterQuerybuilder.
     *
     * @param QueryFactory $queryFactory Factory used to build sub-queries
     */
    public function __construct(
        QueryFactory $queryFactory/* ,
        FulltextQueryBuilder $fulltextQueryBuilder,
        FilterQueryBuilder $filterQuerybuilder */
    ) {
        $this->queryFactory = $queryFactory;
        // $this->fulltextQueryBuilder = $fulltextQueryBuilder;
        // $this->filterQueryBuilder   = $filterQuerybuilder;
    }

    /**
     * Create a filtered query with an optional fulltext query part
     * TODO add support for ContainerConfigureInterface, $filters and $spellingType.
     *
     * @param string|QueryInterface|null $query Search query
     */
    public function createQuery(/*ContainerConfigurationInterface $containerConfiguration, */ string|null|QueryInterface $query/*, array $filters, $spellingType*/): QueryInterface
    {
        $queryParams = [];

        if ($query) {
            if (\is_object($query)) {
                $queryParams['query'] = $query;
            }
            /*
            if (is_string($query) || is_array($query)) {
                $queryParams['query'] = $this->createFulltextQuery($containerConfiguration, $query, $spellingType);
            }
            */
        }

        /*
        if (!empty($filters)) {
            $queryParams['filter'] = $this->createFilterQuery($containerConfiguration, $filters);
        }
        */

        return $this->queryFactory->create(QueryInterface::TYPE_FILTER, $queryParams);
    }

    /*
     * Create a query from filters passed as arguments.
     *
     * @param ContainerConfigurationInterface $containerConfiguration Search request container configuration.
     * @param array                           $filters                Filters used to build the query.
     *
     * @return QueryInterface
     */
    /*
    public function createFilterQuery(ContainerConfigurationInterface $containerConfiguration, array $filters)
    {
        return $this->filterQueryBuilder->create($containerConfiguration, $filters);
    }
    */

    /*
     * Create a query from a search text query.
     *
     * @param ContainerConfigurationInterface $containerConfiguration Search request container configuration.
     * @param string|null                     $queryText              Fulltext query.
     * @param string                          $spellingType           For fulltext query : the type of spellchecked applied.
     *
     * @return QueryInterface
     */
    /*
    public function createFulltextQuery(ContainerConfigurationInterface $containerConfiguration, $queryText, $spellingType)
    {
        return $this->fulltextQueryBuilder->create($containerConfiguration, $queryText, $spellingType);
    }
    */

    /*
     * Create a query from filters passed as arguments.
     *
     * @deprecated
     *
     * @param ContainerConfigurationInterface $containerConfiguration Search request container configuration.
     * @param array                           $filters                Filters used to build the query.
     *
     * @return QueryInterface
     */
    /*
    public function createFilters(ContainerConfigurationInterface $containerConfiguration, array $filters)
    {
        return $this->createFilterQuery($containerConfiguration, $filters);
    }
    */
}
