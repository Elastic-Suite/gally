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

namespace Gally\Category\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Exception;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Category\Model\Category\ProductMerchandising;
use Gally\Category\Repository\CategoryRepository;
use Gally\Category\Service\CategoryProductPositionManager;
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
