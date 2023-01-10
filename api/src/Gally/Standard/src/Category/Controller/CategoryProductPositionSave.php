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

namespace Gally\Category\Controller;

use Gally\Catalog\Repository\CatalogRepository;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Category\Model\Category\ProductMerchandising;
use Gally\Category\Repository\CategoryRepository;
use Gally\Category\Service\CategoryProductPositionManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
class CategoryProductPositionSave extends AbstractController
{
    public function __construct(
        private CategoryRepository $categoryRepository,
        private CatalogRepository $catalogRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private CategoryProductPositionManager $categoryProductPositionManager,
    ) {
    }

    public function __invoke(string $categoryId, Request $request): ProductMerchandising
    {
        $body = json_decode($request->getContent(), true);
        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new BadRequestHttpException(sprintf('Category with id %s not found.', $categoryId));
        }

        $catalogId = $body['catalogId'] ?? null;
        $catalog = $catalogId ? $this->catalogRepository->find($catalogId) : null;
        if ($catalogId && !$catalog) {
            throw new BadRequestHttpException(sprintf('Catalog with id %d not found.', $catalogId));
        }

        $localizedCatalogId = $body['localizedCatalogId'] ?? null;
        $localizedCatalog = $localizedCatalogId ? $this->localizedCatalogRepository->find($localizedCatalogId) : null;
        if ($localizedCatalogId && !$localizedCatalog) {
            throw new BadRequestHttpException(sprintf('Localized catalog with id %d not found.', $localizedCatalogId));
        }

        $positionsJson = $body['positions'] ?? null;
        if (null === $positionsJson) {
            throw new BadRequestHttpException('Positions are empty.');
        }

        $positions = json_decode($positionsJson, true);
        if (false === $positions || null === $positions) {
            throw new BadRequestHttpException('JSON positions object cannot be decoded.');
        }

        $this->categoryProductPositionManager->savePositions(
            $positions,
            $category,
            $catalog,
            $localizedCatalog
        );

        $productMerchandising = new ProductMerchandising();
        $productMerchandising->setId(0);

        return $productMerchandising;
    }
}
