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

use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class CategoryConfigurationGet extends AbstractController
{
    public function __construct(
        private CategoryConfigurationRepository $configurationRepository,
        private CatalogRepository $catalogRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private CategoryRepository $categoryRepository,
        private RequestStack $requestStack,
    ) {
    }

    public function __invoke(string $categoryId)
    {
        $request = $this->requestStack->getCurrentRequest();

        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new NotFoundHttpException(sprintf('Category with id %s not found.', $categoryId));
        }

        $catalogId = $request->query->get('catalogId');
        $catalog = $catalogId ? $this->catalogRepository->find($catalogId) : null;
        if ($catalogId && !$catalog) {
            throw new NotFoundHttpException(sprintf('Catalog with id %d not found.', $catalogId));
        }

        $localizedCatalogId = $request->query->get('localizedCatalogId');
        $localizedCatalog = $localizedCatalogId ? $this->localizedCatalogRepository->find($localizedCatalogId) : null;
        if ($localizedCatalogId && !$localizedCatalog) {
            throw new NotFoundHttpException(sprintf('Localized catalog with id %d not found.', $localizedCatalogId));
        }

        $config = $this->configurationRepository->findOneMergedByContext($category, $catalog, $localizedCatalog);

        if (!$config) {
            throw new NotFoundHttpException('Not found');
        }

        return $config;
    }
}
