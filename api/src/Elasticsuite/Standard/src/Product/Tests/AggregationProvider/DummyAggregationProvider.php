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

namespace Elasticsuite\Product\Tests\AggregationProvider;

use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\AggregationProviderInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;

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
