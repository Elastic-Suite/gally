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

namespace Gally\Product\Tests\AggregationProvider;

use Gally\Search\Elasticsearch\Request\Aggregation\Provider\AggregationProviderInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;

/**
 * Default Aggregations Provider for Search Requests.
 */
class DummyAggregationProvider implements AggregationProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function getAggregations(
        ContainerConfigurationInterface $containerConfiguration,
        $query = null,
        $filters = [],
        $queryFilters = []
    ): array {
        return [];
    }
}
