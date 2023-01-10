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

namespace Gally\Product\DataProvider\Facet;

use Gally\Product\Model\Facet\Option;

class OptionDataProvider extends \Gally\Search\DataProvider\Facet\OptionDataProvider
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
