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

namespace Elasticsuite\Category\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Parameter;
use ApiPlatform\Core\OpenApi\OpenApi;

final class CategoryDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);

        // Remove swagger documentation for the endpoint /category_product_merchandisings/{id}.
        $path = $openApi->getPaths()->getPath('/category_product_merchandisings/{id}');
        $openApi->getPaths()->addPath('/category_product_merchandisings/{id}', $path->withGet(null));

        // Remove id parameter added automatically by API Platform
        $path = $openApi->getPaths()->getPath('/category_product_merchandisings/getPositions/{categoryId}/{localizedCatalogId}');
        $parametersWithoutId = [];
        /** @var Parameter $parameter */
        foreach ($path->getGet()->getParameters() as $parameter) {
            if ('id' !== $parameter->getName()) {
                $parametersWithoutId[] = $parameter;
            }
        }

        $openApi->getPaths()->addPath(
            '/category_product_merchandisings/getPositions/{categoryId}/{localizedCatalogId}',
            $path->withGet($path->getGet()->withParameters($parametersWithoutId))
        );

        return $openApi;
    }
}
