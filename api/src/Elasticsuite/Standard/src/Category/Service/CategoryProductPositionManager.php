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

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Model\Category\ProductMerchandising;
use Elasticsuite\Category\Repository\CategoryProductMerchandisingRepository;
use Elasticsuite\Category\Repository\CategoryProductPositionIndexer\CategoryProductPositionIndexerRepositoryInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder as RequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Model\Document;

class CategoryProductPositionManager
{
    /**
     * Max position count by category.
     */
    public const MAX_POSITION_COUNT = 25;

    public function __construct(
        private CategoryProductMerchandisingRepository $categoryProductMerchandisingRepository,
        private CategoryProductPositionIndexerRepositoryInterface $categoryProductPositionIndexerRepository,
        private MetadataRepository $metadataRepository,
        private EntityManagerInterface $entityManager,
        private RequestBuilder $requestBuilder,
        private Adapter $adapter,
        private QueryFactory $queryFactory,
    ) {
    }

    public function reindexPosition(ProductMerchandising $productMerchandising): void
    {
        // Localized catalog  scope.
        if ($productMerchandising->getLocalizedCatalog()) {
            $this->reindexPositionByLocalizedCatalogs($productMerchandising, [$productMerchandising->getLocalizedCatalog()]);
            if (null === $productMerchandising->getPosition()) { // Delete mode.
                // Reindex parent scope position to refresh product position in elasticsearch.
                $positionsToReindex = $this->categoryProductMerchandisingRepository->findBy(
                    [
                        'localizedCatalog' => null,
                        'category' => $productMerchandising->getCategory(),
                        'productId' => $productMerchandising->getProductId(),
                    ],
                    ['catalog' => 'DESC'] // To have global positions first.
                );

                foreach ($positionsToReindex as $positionToReindex) {
                    $this->reindexPosition($positionToReindex);
                }
            }
            // Catalog  scope.
        } elseif (null !== $productMerchandising->getCatalog() && null === $productMerchandising->getLocalizedCatalog()) {
            $localizedCatalogsToReindex = $this->categoryProductMerchandisingRepository->findLocalizedCatalogsToReindexForCatalogScope($productMerchandising);
            $this->reindexPositionByLocalizedCatalogs($productMerchandising, $localizedCatalogsToReindex);
            if (null === $productMerchandising->getPosition()) { // Delete mode.
                // Reindex parent scope position to refresh product position in elasticsearch.
                $positionToReindex = $this->categoryProductMerchandisingRepository->findOneBy([
                    'localizedCatalog' => null,
                    'catalog' => null,
                    'category' => $productMerchandising->getCategory(),
                    'productId' => $productMerchandising->getProductId(),
                ]);
                if ($positionToReindex instanceof ProductMerchandising) {
                    $this->reindexPosition($positionToReindex);
                }
            }
            // Global scope.
        } else {
            $localizedCatalogsToReindex = $this->categoryProductMerchandisingRepository->findLocalizedCatalogsToReindexForGlobalScope($productMerchandising);

            $catalogs = $this->categoryProductMerchandisingRepository->findCatalogsByPositionAsArray($productMerchandising);
            $catalogs = array_column($catalogs, 'id');
            // Remove localized catalogs from $localizedCatalogsToReindex if a value exists in catalog scope.
            foreach ($localizedCatalogsToReindex as $index => $localizedCatalogToReindex) {
                if (\in_array($localizedCatalogToReindex->getCatalog()?->getId(), $catalogs, true)) {
                    unset($localizedCatalogsToReindex[$index]);
                }
            }

            $this->reindexPositionByLocalizedCatalogs($productMerchandising, $localizedCatalogsToReindex);
        }
    }

    /**
     * @param Index           $index    Index
     * @param array<int, int> $products Products
     */
    public function reindexPositionsByIndex(Index $index, array $products = []): void
    {
        $products = $this->categoryProductMerchandisingRepository->findProductsWithDataPositionToReindex(
            $index->getCatalog(),
            $products
        );

        $productsToReindex = [];
        foreach ($products as $product) {
            $productsToReindex[$product['product_id']][$product['category_id']] = [
                'position' => $product['position'],
            ];
        }
        if (!empty($productsToReindex)) {
            $this->categoryProductPositionIndexerRepository->reindexByProducts($productsToReindex, $index->getCatalog());
        }
    }

    /**
     * @param ProductMerchandising $productMerchandising Position
     * @param LocalizedCatalog[]   $localizedCatalogs    Localized catalogs
     */
    public function reindexPositionByLocalizedCatalogs(ProductMerchandising $productMerchandising, array $localizedCatalogs): void
    {
        $this->categoryProductPositionIndexerRepository->reindex($productMerchandising, $localizedCatalogs);
    }

    /**
     * Save position on database and elasticsearch.
     */
    public function savePositions(array $positionsData, Category $category, ?Catalog $catalog, ?LocalizedCatalog $localizedCatalog): void
    {
        $this->validatePosition($positionsData);
        $this->entityManager->beginTransaction();
        $positionsScoped = [];
        try {
            $positionsScoped = $this->categoryProductMerchandisingRepository->findBy([
                'category' => $category,
                'catalog' => $catalog,
                'localizedCatalog' => $localizedCatalog,
            ]);

            foreach ($positionsScoped as $positionScoped) {
                $this->entityManager->remove($positionScoped);
            }
            $this->entityManager->flush();

            foreach ($positionsData as $positionData) {
                $newProductMerchandising = new Category\ProductMerchandising();
                $newProductMerchandising->setCatalog($catalog);
                $newProductMerchandising->setLocalizedCatalog($localizedCatalog);
                $newProductMerchandising->setCategory($category);
                $newProductMerchandising->setProductId((int) $positionData['productId']);
                $newProductMerchandising->setPosition((int) $positionData['position']);
                $this->entityManager->persist($newProductMerchandising);
            }
            $this->entityManager->flush();
            $this->entityManager->getConnection()->commit();
        } catch (\Exception $e) {
            $this->entityManager->getConnection()->rollBack();
            foreach ($positionsScoped as $positionScoped) {
                $this->reindexPosition($positionScoped);
            }

            throw $e;
        }
    }

    private function validatePosition(array $positions): void
    {
        if (\count($positions) > self::MAX_POSITION_COUNT) {
            throw new InvalidArgumentException(sprintf('Position count exceeds maximum limit %d', self::MAX_POSITION_COUNT, ));
        }

        $productIds = [];
        foreach ($positions as $index => $position) {
            if (!isset($position['productId']) || !isset($position['position'])
                || !is_numeric($position['productId']) || !is_numeric($position['position'])
            ) {
                throw new InvalidArgumentException(sprintf("In positions array, position #%d is wrong: 'productId or position is missing, empty or not a numeric'", $index));
            }
            if (isset($productIds[$position['productId']])) {
                throw new InvalidArgumentException(sprintf("In positions array, the product id '%d' appears twice.", $position['productId']));
            }
            $productIds[(int) $position['productId']] = true;
        }
    }

    public function getProductPositions(Category $category, LocalizedCatalog $localizedCatalog): array
    {
        $productPositions = [];

        $metadata = $this->metadataRepository->findByEntity('product');
        $query = $this->queryFactory->create(
            QueryInterface::TYPE_NESTED,
            [
                'path' => 'category',
                'query' => $this->queryFactory->create(
                    QueryInterface::TYPE_BOOL,
                    ['must' => [
                        $this->queryFactory->create(
                            QueryInterface::TYPE_TERMS,
                            ['values' => $category->getId(), 'field' => 'category.id']
                        ),
                        $this->queryFactory->create(
                            QueryInterface::TYPE_EXISTS,
                            ['field' => 'category.position']
                        ),
                    ],
                    ]
                ),
            ]
        );

        $request = $this->requestBuilder->create(
            $metadata,
            $localizedCatalog,
            0,
            self::MAX_POSITION_COUNT,
            null,
            [],
            [$query]
        );

        $response = $this->adapter->search($request);
        /** @var Document $document */
        foreach ($response->getIterator() as $document) {
            $categories = $document->getSource()['category'] ?? [];

            foreach ($categories as $categoryItem) {
                if (isset($categoryItem['position']) && isset($categoryItem['id']) && $categoryItem['id'] === $category->getId()) {
                    $productPositions[] = ['productId' => (int) $document->getId(), 'position' => (int) $categoryItem['position']];
                    break;
                }
            }
        }
        // sort by position.
        usort($productPositions, fn ($a, $b) => $a['position'] <=> $b['position']);

        return $productPositions;
    }
}
