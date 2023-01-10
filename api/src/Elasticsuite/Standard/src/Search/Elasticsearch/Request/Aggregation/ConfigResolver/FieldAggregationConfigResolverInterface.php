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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\ConfigResolver;

use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Facet\Configuration;

interface FieldAggregationConfigResolverInterface
{
    public function supports(Configuration $facetConfig): bool;

    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array;
}
