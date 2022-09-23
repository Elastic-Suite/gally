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

namespace Elasticsuite\Category\Service;

use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Catalog\Service\DefaultCatalogProvider;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Model\CategoryTree;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CategoryTreeBuilder
{
    public function __construct(
        private CatalogRepository $catalogRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private CategoryRepository $categoryRepository,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        private DefaultCatalogProvider $defaultCatalogProvider,
    ) {
    }

    public function buildTree(?int $catalogId, ?int $localizedCatalogId): CategoryTree
    {
        $localizedCatalog = $localizedCatalogId ? $this->localizedCatalogRepository->find($localizedCatalogId) : null;
        if ($localizedCatalogId && !$localizedCatalog) {
            throw new NotFoundHttpException(sprintf('Localized catalog with id %d not found.', $localizedCatalogId));
        }

        $catalog = $catalogId
            ? $this->catalogRepository->find($catalogId)
            : $localizedCatalog?->getCatalog();
        if ($catalogId && !$catalog) {
            throw new NotFoundHttpException(sprintf('Catalog with id %d not found.', $catalogId));
        }

        $sortedCategories = $this->getSortedCategories($catalog, $localizedCatalog);

        return new CategoryTree($catalogId, $localizedCatalogId, $this->buildCategoryTree($sortedCategories));
    }

    private function getSortedCategories(?Catalog $catalog, ?LocalizedCatalog $localizedCatalog): array
    {
        $shouldDisplayInactive = null === $localizedCatalog;

        if (!$localizedCatalog) {
            if (!$catalog) {
                $localizedCatalog = $this->defaultCatalogProvider->getDefaultLocalizedCatalog();
            } else {
                $localizedCatalog = $catalog->getLocalizedCatalogs()->first();
            }
        }

        $categoryConfigurations = $catalog
            ? $this->categoryConfigurationRepository->findMergedByContext($catalog, $localizedCatalog)
            : $this->categoryConfigurationRepository->findAllMerged($localizedCatalog);

        $sortedCategories = [];
        $categories = $this->categoryRepository->findAllIndexedById();

        foreach ($categoryConfigurations as $categoryConfigurationData) {
            $category = $categories[$categoryConfigurationData['category_id']];
            $categoryConfiguration = new Category\Configuration();
            $categoryConfiguration->setCategory($category);
            $categoryConfiguration->setName($categoryConfigurationData['name']);
            $categoryConfiguration->setIsVirtual((bool) $categoryConfigurationData['isVirtual']);
            $categoryConfiguration->setVirtualRule($categoryConfigurationData['virtualRule']);
            $categoryConfiguration->setDefaultSorting($categoryConfigurationData['defaultSorting']);
            $categoryConfiguration->setUseNameInProductSearch((bool) $categoryConfigurationData['useNameInProductSearch']);
            $categoryConfiguration->setIsActive((bool) $categoryConfigurationData['isActive']);

            if (!$shouldDisplayInactive && !$categoryConfiguration->getIsActive()) {
                continue;
            }

            $level = $category->getLevel();
            if (!\array_key_exists($level, $sortedCategories)) {
                $sortedCategories[$level] = [];
            }

            $parent = $category->getParentId() ?: 'root';
            $parentCategories = &$sortedCategories[$level];
            if (!\array_key_exists($parent, $parentCategories)) { // @phpstan-ignore-line
                $parentCategories[$parent] = [];
            }

            $parentCategories[$parent][] = $categoryConfiguration;
        }

        return $sortedCategories;
    }

    private function buildCategoryTree(array $sortedCategories, int $level = 1, string $parentId = 'root'): array
    {
        $tree = [];

        foreach ($sortedCategories[$level][$parentId] ?? [] as $categoryConfiguration) {
            $tree[] = $this->buildCategoryNode($sortedCategories, $categoryConfiguration);
        }

        return $tree;
    }

    private function buildCategoryNode(array $sortedCategories, Category\Configuration $categoryConfiguration): array
    {
        $category = $categoryConfiguration->getCategory();
        $children = $this->buildCategoryTree(
            $sortedCategories,
            $category->getLevel() + 1,
            $category->getId()
        );

        $node = [
            'id' => $category->getId(),
            'name' => $categoryConfiguration->getName(),
            'level' => $category->getLevel(),
            'path' => $category->getPath(),
            'isVirtual' => $categoryConfiguration->getIsVirtual(),
        ];

        if (!empty($children)) {
            $node['children'] = $children;
        }

        return $node;
    }
}
