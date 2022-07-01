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

use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Elasticsuite\Search\Model\Document;

class CategorySynchronizer
{
    private const MAX_SAVE_BATCH_SIZE = 1000;

    public function __construct(
        private CategoryRepository $categoryRepository,
        private RequestFactoryInterface $requestFactory,
        private QueryBuilder $queryBuilder,
        private Adapter $adapter,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param array $bulkCategories category in bulk query
     */
    public function synchronize(Index $index, array $bulkCategories = []): void
    {
        $catalog = $index->getCatalog();
        $elasticCategories = $this->getCategoriesInElastic($index);
        $sqlCategories = $this->getCategoriesInSql($index);

        $bulkCategoryIds = array_keys($bulkCategories);
        $elasticCategoryIds = array_keys($elasticCategories);
        $sqlCategoryIds = array_keys($sqlCategories);

        $categoriesToAdd = array_diff($elasticCategoryIds, $sqlCategoryIds);
        $categoriesToUpdate = array_diff($bulkCategoryIds, $categoriesToAdd);
        $categoriesToRemove = array_diff($sqlCategoryIds, $elasticCategoryIds);

        $currentBatchSize = 0;
        foreach (array_merge($categoriesToAdd, $categoriesToUpdate) as $categoryId) {
            $categoryDoc = $elasticCategories[$categoryId];
            $category = $sqlCategories[$categoryId] ?? new Category();
            $category->setCatalog($catalog);
            $category->setCategoryId($categoryDoc->getSource()['categoryId']);
            $category->setParentId($categoryDoc->getSource()['parentId'] ?? '');
            $category->setLevel((int) ($categoryDoc->getSource()['level'] ?? 0));
            $category->setPath($categoryDoc->getSource()['path'] ?? '');
            $category->setName($categoryDoc->getSource()['name'] ?? '');
            $this->entityManager->persist($category);
            ++$currentBatchSize;
            if ($currentBatchSize > self::MAX_SAVE_BATCH_SIZE) {
                $this->entityManager->flush();
                $this->entityManager->clear();
                $currentBatchSize = 0;
            }
        }

        foreach ($categoriesToRemove as $categoryId) {
            $this->entityManager->remove($sqlCategories[$categoryId]);
            ++$currentBatchSize;
            if ($currentBatchSize > self::MAX_SAVE_BATCH_SIZE) {
                $this->entityManager->flush();
                $this->entityManager->clear();
                $currentBatchSize = 0;
            }
        }

        $this->entityManager->flush();
        $this->entityManager->clear();
    }

    /**
     * @return Category[]
     */
    private function getCategoriesInSql(Index $index): array
    {
        return $this->setIdAsKey($this->categoryRepository->findBy(['catalog' => $index->getCatalog()]));
    }

    /**
     * @return Document[]
     */
    private function getCategoriesInElastic(Index $index): array
    {
        $elasticCategories = [];
        $page = 0;
        $pageSize = 10000;

        do {
            $request = $this->requestFactory->create([
                'name' => 'test',
                'indexName' => $index->getName(),
                'query' => $this->queryBuilder->createQuery(null),
                'from' => $page * $pageSize,
                'size' => $pageSize,
            ]);
            $data = iterator_to_array($this->adapter->search($request));
            $elasticCategories += $this->setIdAsKey($data);
            ++$page;
        } while (\count($data));

        return $elasticCategories;
    }

    /**
     * @param Document[]|Category[] $categoryList
     */
    private function setIdAsKey(array $categoryList): array
    {
        $categories = [];
        array_walk(
            $categoryList,
            function (Document|Category $category) use (&$categories) {
                $key = $category instanceof Category ? $category->getCategoryId() : $category->getId();
                $categories[$key] = $category;
            }
        );

        return $categories;
    }
}
