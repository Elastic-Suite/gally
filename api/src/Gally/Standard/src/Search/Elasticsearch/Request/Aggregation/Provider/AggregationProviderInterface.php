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

namespace Gally\Search\Elasticsearch\Request\Aggregation\Provider;

use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;

/**
 * Aggregations Provider interface for search requests.
 */
interface AggregationProviderInterface
{
    /**
     * Returns aggregations configured in the search container, and according to currently applied query and filters.
     *
     * @param ContainerConfigurationInterface $containerConfig search container configuration
     * @param string|QueryInterface|null      $query           search request query
     * @param array                           $filters         search request filters
     * @param QueryInterface[]                $queryFilters    search request filters prebuilt as QueryInterface
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfig,
        QueryInterface|string|null $query = null,
        array $filters = [],
        array $queryFilters = []
    ): array;
}
