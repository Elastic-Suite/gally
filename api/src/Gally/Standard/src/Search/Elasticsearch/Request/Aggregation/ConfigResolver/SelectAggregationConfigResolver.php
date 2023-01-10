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

namespace Gally\Search\Elasticsearch\Request\Aggregation\ConfigResolver;

use Gally\Metadata\Model\SourceField;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Model\Facet\Configuration;

class SelectAggregationConfigResolver implements FieldAggregationConfigResolverInterface
{
    public function supports(Configuration $facetConfig): bool
    {
        return SourceField\Type::TYPE_SELECT === $facetConfig->getSourceField()->getType();
    }

    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array
    {
        return [
            'name' => $facetConfig->getSourceField()->getCode() . '.value',
            'type' => BucketInterface::TYPE_MULTI_TERMS,
            'additionalFields' => [
                $facetConfig->getSourceField()->getCode() . '.label',
            ],
        ];
    }
}
