<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Provider;

use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;

/**
 * Default Aggregations Provider for Search Requests.
 */
class GenericAggregationProvider implements AggregationProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfig,
        $query = null,
        $filters = [],
        $queryFilters = []
    ): array {
        return [];
    }
}
