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

use Elasticsuite\Entity\Service\PriceGroupProvider;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Facet\Configuration;

class PriceAggregationConfigResolver implements FieldAggregationConfigResolverInterface
{
    public function __construct(
        private PriceGroupProvider $priceGroupProvider
    ) {
    }

    public function supports(Configuration $facetConfig): bool
    {
        return SourceField\Type::TYPE_PRICE === $facetConfig->getSourceField()->getType();
    }

    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array
    {
        return [
            'name' => $facetConfig->getSourceField()->getCode() . '.price',
            'type' => BucketInterface::TYPE_HISTOGRAM,
            'nestedFilter' => [$facetConfig->getSourceField()->getCode() . '.group_id' => $this->priceGroupProvider->getCurrentPriceGroupId()],
            'minDocCount' => 1,
        ];
    }
}
