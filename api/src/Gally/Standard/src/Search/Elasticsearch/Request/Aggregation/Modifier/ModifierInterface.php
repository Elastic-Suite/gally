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

namespace Gally\Search\Elasticsearch\Request\Aggregation\Modifier;

use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Model\Facet\Configuration as FacetConfiguration;

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
