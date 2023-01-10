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

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Facet\Configuration;

class NumericAggregationConfigResolver implements FieldAggregationConfigResolverInterface
{
    public function supports(Configuration $facetConfig): bool
    {
        return \in_array(
            $facetConfig->getSourceField()->getType(),
            [
                SourceField\Type::TYPE_INT,
                SourceField\Type::TYPE_FLOAT,
            ], true
        );
    }

    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array
    {
        return [
            'name' => $facetConfig->getSourceField()->getCode(),
            'type' => BucketInterface::TYPE_HISTOGRAM,
            'minDocCount' => 1,
        ];
    }
}
