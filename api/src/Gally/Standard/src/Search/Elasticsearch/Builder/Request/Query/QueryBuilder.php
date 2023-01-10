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

namespace Gally\Search\Elasticsearch\Builder\Request\Query;

use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Builder\Request\Query\Fulltext\FulltextQueryBuilder;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Elasticsearch\SpellcheckerInterface;

/**
 * Builder for query part of the search request.
 */
class QueryBuilder
{
    /**
     * Constructor.
     *
     * @param QueryFactory $queryFactory Factory used to build sub-queries
     */
    public function __construct(
        private QueryFactory $queryFactory,
        private FulltextQueryBuilder $fulltextQueryBuilder,
        private FilterQueryBuilder $filterQueryBuilder,
    ) {
    }

    /**
     * Create a filtered query with an optional fulltext query part.
     *
     * @param ContainerConfigurationInterface  $containerConfiguration Search request configuration
     * @param string|array|QueryInterface|null $query                  Search query
     * @param array                            $filters                Filter part of the query
     * @param int                              $spellingType           For fulltext query : the type of spellchecked applied
     */
    public function createQuery(
        ContainerConfigurationInterface $containerConfiguration,
        string|array|null|QueryInterface $query,
        array $filters,
        int $spellingType = SpellcheckerInterface::SPELLING_TYPE_EXACT
    ): QueryInterface {
        $queryParams = [];

        if ($query) {
            if (\is_object($query)) {
                $queryParams['query'] = $query;
            }
            if (\is_string($query) || \is_array($query)) {
                $queryParams['query'] = $this->createFulltextQuery($containerConfiguration, $query, $spellingType);
            }
        }

        if (!empty($filters)) {
            $queryParams['filter'] = $this->createFilterQuery($containerConfiguration, $filters);
        }

        return $this->queryFactory->create(QueryInterface::TYPE_FILTER, $queryParams);
    }

    /**
     * Create a query from filters passed as arguments.
     *
     * @param ContainerConfigurationInterface $containerConfiguration search request container configuration
     * @param array                           $filters                filters used to build the query
     */
    public function createFilterQuery(ContainerConfigurationInterface $containerConfiguration, array $filters): QueryInterface
    {
        return $this->filterQueryBuilder->create($containerConfiguration, $filters);
    }

    /*
     * Create a query from a search text query.
     *
     * @param ContainerConfigurationInterface $containerConfiguration Search request container configuration.
     * @param string                     $queryText              Fulltext query.
     * @param string                     $spellingType           For fulltext query : the type of spellchecked applied.
     */
    public function createFulltextQuery(
        ContainerConfigurationInterface $containerConfiguration,
        string $queryText,
        int $spellingType
    ): QueryInterface {
        return $this->fulltextQueryBuilder->create($containerConfiguration, $queryText, $spellingType);
    }

    /*
     * Create a query from filters passed as arguments.
     *
     * @deprecated
     *
     * @param ContainerConfigurationInterface $containerConfiguration Search request container configuration.
     * @param array                           $filters                Filters used to build the query.
     */
    /*
    public function createFilters(ContainerConfigurationInterface $containerConfiguration, array $filters): QueryInterface
    {
        return $this->createFilterQuery($containerConfiguration, $filters);
    }
    */
}
