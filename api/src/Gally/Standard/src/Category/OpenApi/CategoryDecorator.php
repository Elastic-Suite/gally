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

namespace Gally\Category\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\Model\Parameter;
use ApiPlatform\Core\OpenApi\OpenApi;
use Gally\OpenApi\Helper\Documentation as DocumentationHelper;

final class CategoryDecorator implements OpenApiFactoryInterface
{
    public function __construct(
        private DocumentationHelper $documentationHelper,
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
        $this->documentationHelper->removeFieldFromEndpoint(
            $openApi,
            '/category_product_merchandisings/getPositions/{categoryId}/{localizedCatalogId}',
            'id'
        );

        return $openApi;
    }
}
