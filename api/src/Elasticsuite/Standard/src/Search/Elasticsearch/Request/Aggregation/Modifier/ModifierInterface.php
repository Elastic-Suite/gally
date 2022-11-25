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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier;

use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Model\Facet\Configuration as FacetConfiguration;

/**
 * Modifier Interface for attributes aggregations provider.
 */
interface ModifierInterface
{
    /**
     * @param ContainerConfigurationInterface $containerConfig search container configuration
     * @param FacetConfiguration[]            $facetConfigs    facet configurations
     * @param string|QueryInterface|null      $query           search request query
     * @param array                           $filters         search request filters
     * @param QueryInterface[]                $queryFilters    search request filters prebuilt as QueryInterface
     *
     * @return FacetConfiguration[]
     */
    public function modifyFacetConfigs(
        ContainerConfigurationInterface $containerConfig,
        array $facetConfigs,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array;

    /**
     * @param ContainerConfigurationInterface $containerConfig search container configuration
     * @param array                           $aggregations    the aggregations
     * @param string|QueryInterface|null      $query           search request query
     * @param array                           $filters         search request filters
     * @param QueryInterface[]                $queryFilters    search request filters prebuilt as QueryInterface
     */
    public function modifyAggregations(
        ContainerConfigurationInterface $containerConfig,
        array $aggregations,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array;
}
