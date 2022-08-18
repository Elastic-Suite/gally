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

namespace Elasticsuite\Category\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Category\Model\Category\ProductMerchandising;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Category\Service\CategoryProductPositionManager;
use Exception;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class PositionGetResolver implements QueryItemResolverInterface
{
    public function __construct(
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private CategoryProductPositionManager $categoryProductPositionManager,
        private CategoryRepository $categoryRepository,
    ) {
    }

    /**
     * @param mixed $item
     *
     * @throws Exception
     */
    public function __invoke($item, array $context): ProductMerchandising
    {
        $categoryId = $context['args']['categoryId'];
        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new BadRequestHttpException(sprintf('Category with id %s not found.', $categoryId));
        }

        $localizedCatalogId = $context['args']['localizedCatalogId'];
        $localizedCatalog = $this->localizedCatalogRepository->find($localizedCatalogId);
        if (!$localizedCatalog) {
            throw new BadRequestHttpException(sprintf('Localized catalog with id %d not found.', $localizedCatalogId));
        }

        $productPositions = $this->categoryProductPositionManager->getProductPositions(
            $category,
            $localizedCatalog
        );

        $productMerchandising = new ProductMerchandising();
        $productMerchandising->setId(0);
        $productMerchandising->setResult(json_encode($productPositions));

        return $productMerchandising;
    }
}
