<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\VirtualCategory\Decoration\Repository\CategoryProductPositionIndexer;

use Elasticsearch\Client;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Repository\CategoryProductPositionIndexer\CategoryProductPositionIndexerRepository as BaseCategoryProductPositionIndexerRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Index\Service\IndexSettings;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Psr\Log\LoggerInterface;

class CategoryProductPositionIndexerRepository extends BaseCategoryProductPositionIndexerRepository
{
    public function __construct(
        private Client $client,
        private MetadataRepository $metadataRepository,
        private IndexSettings $indexSettings,
        private IndexRepositoryInterface $indexRepository,
        private LoggerInterface $logger,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        private CategoryRepository $categoryRepository,
    ) {
        parent::__construct($this->client, $this->metadataRepository, $this->indexSettings, $this->indexRepository, $this->logger);
    }

    /**
     * Override: Flag products categories as virtual if it is.
     * $products format:
     * [
     *    '15 (product_id)' => [
     *        '1 (category_id)' => [
     *            'position'    => 10,
     *        ],
     *        '2 (category_id)' => [
     *            'position'    => 5,
     *        ]
     *    ],
     *    '17 (product_id)' => [
     *        '15 (category_id)' => [
     *            'position'    => 1,
     *        ],
     *        ...
     *    ],
     *    ...
     * ].
     *
     * {@inheritDoc}
     */
    public function reindexByProducts(array $products, LocalizedCatalog $localizedCatalog): void
    {
        $categoryIds = [];
        foreach ($products as $productCategories) {
            $categoryIds = array_merge($categoryIds, array_keys($productCategories));
        }

        if (!empty($categoryIds)) {
            $categories = $this->categoryRepository->findBy(['id' => $categoryIds]);
            $categoryConfigurations = $this->categoryConfigurationRepository->findMergedByContextAndCategories($localizedCatalog->getCatalog(), $localizedCatalog, $categories);

            foreach ($products as &$productCategories) {
                foreach ($productCategories as $categoryId => &$productCategory) {
                    $key = array_search($categoryId, array_column($categoryConfigurations, 'category_id'), true);
                    if (false !== $key && isset($categoryConfigurations[$key]['isVirtual']) && $categoryConfigurations[$key]['isVirtual']) {
                        $productCategory['is_virtual'] = true;
                    }
                }
            }
        }

        parent::reindexByProducts($products, $localizedCatalog);
    }

    /**
     * Override: Add/update virtual categories data (position + is_virtual).
     */
    protected function getCategoriesWithUpdatedData(array $productCategories, array $newPositionsByCategory): array
    {
        foreach ($newPositionsByCategory as $categoryId => $newPositionByCategory) {
            $key = array_search($categoryId, array_column($productCategories, 'id'), true);
            if (false === $key && !isset($newPositionByCategory['is_virtual'])) {
                continue;
            }

            if (false !== $key) {
                $productCategories[$key]['position'] = $newPositionByCategory['position'];
                // if the position is null, that means the position has been deleted.
                if (null === $newPositionByCategory['position']) {
                    unset($productCategories[$key]['position']);
                }

                if (isset($newPositionByCategory['is_virtual']) && $newPositionByCategory['is_virtual'] && null !== $newPositionByCategory['position']) {
                    $productCategories[$key]['is_virtual'] = 'true';
                } else {
                    unset($productCategories[$key]['is_virtual']);
                }
            } elseif (isset($newPositionByCategory['is_virtual']) && null !== $newPositionByCategory['position']) {
                $categoryData = [];
                $categoryData['id'] = $categoryId;
                $categoryData['is_virtual'] = 'true';
                $categoryData['position'] = $newPositionByCategory['position'];
                $productCategories[] = $categoryData;
            }
        }

        return $productCategories;
    }
}
