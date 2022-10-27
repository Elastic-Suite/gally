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

namespace Elasticsuite\Product\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Resolver\Stage\SerializeStageInterface;
use Elasticsuite\Product\Model\Product;

/**
 * Add aggregations data in graphql search document response.
 */
class AddEntityTypeInContext implements SerializeStageInterface
{
    public function __construct(
        private SerializeStageInterface $decorated,
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        if (Product::class === $resourceClass) {
            $context['args']['entityType'] = 'product';
        }

        return $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);
    }
}
