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

namespace Elasticsuite\Product\DataProvider\Facet;

use Elasticsuite\Product\Model\Facet\Option;

class OptionDataProvider extends \Elasticsuite\Search\DataProvider\Facet\OptionDataProvider
{
    public function getCollection(string $resourceClass, string $operationName = null, array $context = [])
    {
        $context['filters']['entityType'] = 'product';

        return parent::getCollection($resourceClass, $operationName, $context);
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Option::class === $resourceClass;
    }
}
