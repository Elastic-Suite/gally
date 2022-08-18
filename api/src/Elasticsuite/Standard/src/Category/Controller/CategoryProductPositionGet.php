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

namespace Elasticsuite\Category\Controller;

use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Category\Model\Category\ProductMerchandising;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Category\Service\CategoryProductPositionManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
class CategoryProductPositionGet extends AbstractController
{
    public function __construct(
        private CategoryRepository $categoryRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private CategoryProductPositionManager $categoryProductPositionManager,
    ) {
    }

    public function __invoke(string $categoryId, int $localizedCatalogId, Request $request): ProductMerchandising
    {
        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new BadRequestHttpException(sprintf('Category with id %s not found.', $categoryId));
        }

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
