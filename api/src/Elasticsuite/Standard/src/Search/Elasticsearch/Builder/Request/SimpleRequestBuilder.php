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

use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Service\MetadataManager;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\SortOrderBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationFactoryInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Elasticsuite\Search\Elasticsearch\RequestInterface;
use Elasticsuite\Search\Elasticsearch\SpellcheckerInterface;

class SimpleRequestBuilder
{
    private ContainerConfigurationFactoryInterface $containerConfigFactory;

    private QueryBuilder $queryBuilder;

    private SortOrderBuilder $sortOrderBuilder;

    // private AggregationBuilder $aggregationBuilder;

    private RequestFactoryInterface $requestFactory;

    // private SpellcheckRequestFactory $spellcheckRequestFactory;

    // private SpellcheckerInterface $spellchecker;

    // private AggregationResolverInterface $aggregationResolver;

    private IndexSettingsInterface $indexSettings;

    private MetadataManager $metadataManager;

    /**
     * Constructor.
     * TODO add support for $aggregationBuilder, $spellcheckRequestFactory, $spellchecker and $aggregationResolver.
     *
     * @param RequestFactoryInterface                $requestFactory         Factory used to build the request
     * @param QueryBuilder                           $queryBuilder           Builder for the query part of the request
     * @param SortOrderBuilder                       $sortOrderBuilder       Builder for the sort order(s) part of the request
     * @param ContainerConfigurationFactoryInterface $containerConfigFactory Container configuration factory
     * @param IndexSettingsInterface                 $indexSettings          Index settings
     * @param MetadataManager                        $metadataManager        Entity metadata manager
     */
    public function __construct(
        RequestFactoryInterface $requestFactory,
        QueryBuilder $queryBuilder,
        SortOrderBuilder $sortOrderBuilder,
        /*
        AggregationBuilder $aggregationBuilder,
        */
        ContainerConfigurationFactoryInterface $containerConfigFactory,
        /*
        SpellcheckRequestFactory $spellcheckRequestFactory,
        SpellcheckerInterface $spellchecker,
        AggregationResolverInterface $aggregationResolver
        */
        IndexSettingsInterface $indexSettings,
        MetadataManager $metadataManager
    ) {
        $this->requestFactory = $requestFactory;
        $this->queryBuilder = $queryBuilder;
        $this->sortOrderBuilder = $sortOrderBuilder;
        $this->containerConfigFactory = $containerConfigFactory;
        // $this->aggregationBuilder = $aggregationBuilder;
        // $this->spellcheckRequestFactory = $spellcheckRequestFactory;
        // $this->spellchecker = $spellchecker;
        // $this->aggregationResolver = $aggregationResolver;
        $this->indexSettings = $indexSettings;
        $this->metadataManager = $metadataManager;
    }

    /**
     * Create a new search request.
     *
     * @param Metadata                   $metadata     Search request target entity metada
     * @param int                        $catalogId    Search request target catalog ID
     * @param int                        $from         Search request pagination from clause
     * @param int                        $size         Search request pagination size
     * @param string|QueryInterface|null $query        Search request query
     * @param array                      $sortOrders   Search request sort orders
     * @param array                      $filters      Search request filters
     * @param QueryInterface[]           $queryFilters Search request filters prebuilt as QueryInterface
     * @param array                      $facets       Search request facets
     */
    public function create(
        Metadata $metadata,
        int $catalogId,
        int $from,
        int $size,
        string|QueryInterface|null $query = null,
        array $sortOrders = [],
        array $filters = [],
        array $queryFilters = [],
        array $facets = []
    ): RequestInterface {
        $containerConfig = $this->getRequestContainerConfiguration($metadata, $catalogId);
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
            'name' => $containerConfig->getName(),
            'indexName' => $containerConfig->getIndexName(),
            'from' => $from,
            'size' => $size,
            // 'query'        => $this->queryBuilder->createQuery($containerConfig, $query, $queryFilters, $spellingType),
            'query' => $this->queryBuilder->createQuery($query),
            'sortOrders' => $this->sortOrderBuilder->buildSortOrders($containerConfig, $sortOrders),
            // 'buckets'      => $this->aggregationBuilder->buildAggregations($containerConfig, $facets, $facetFilters),
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

    /**
     * Create a container configuration based on provided entity metadata and catalog ID.
     *
     * @param Metadata $metadata  Search request target entity metadata
     * @param int      $catalogId Search request target catalog ID
     *
     * @throws \LogicException Thrown when the search container is not found into the configuration
     */
    private function getRequestContainerConfiguration(Metadata $metadata, int $catalogId): ContainerConfigurationInterface
    {
        $indexName = $this->indexSettings->getIndexAliasFromIdentifier(
            $metadata->getEntity(),
            $catalogId
        );

        $mapping = $this->metadataManager->getMapping($metadata);

        return $this->containerConfigFactory->create([
            'containerName' => 'raw',
            'indexName' => $indexName,
            'catalogId' => $catalogId,
            'mapping' => $mapping,
        ]);
    }
}
