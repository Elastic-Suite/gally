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

use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\Persistence\Mapping\MappingException;
use Elasticsuite\Category\Exception\SyncCategoryException;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Elasticsuite\Search\Model\Document;

class CategorySynchronizer
{
    private const MAX_SAVE_BATCH_SIZE = 10000;

    private int $currentBatchSize = 1;
    private array $attachedEntities = [];

    public function __construct(
        private CategoryRepository $categoryRepository,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        private RequestFactoryInterface $requestFactory,
        private QueryBuilder $queryBuilder,
        private Adapter $adapter,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param array $bulkCategories category in bulk query
     *
     * @throws SyncCategoryException
     */
    public function synchronize(Index $index, array $bulkCategories = []): void
    {
        // In order to avoid memory limit error on batch action, the sql logger has been disabled.
        $this->entityManager->getConnection()->getConfiguration()->setSQLLogger();

        $localizedCatalog = $index->getCatalog();
        $elasticCategories = $this->getCategoriesInElastic($index);
        $sqlCategories = $this->getCategoriesInSql();
        $sqlCategoryConfigurations = $this->getCategoryConfigurationsInSql($index);

        $elasticCategoryIds = array_keys($elasticCategories);
        $sqlCategoryIds = array_keys($sqlCategoryConfigurations);
        $bulkCategoryIds = [];
        array_walk(
            $bulkCategories,
            function (array $bulkCategoryData) use (&$bulkCategoryIds) {
                $bulkCategoryIds[] = $bulkCategoryData['id'];
            }
        );

        $categoriesToAdd = array_diff($elasticCategoryIds, $sqlCategoryIds);
        $categoriesToUpdate = array_diff($bulkCategoryIds, $categoriesToAdd);
        $categoryConfigToRemove = array_diff($sqlCategoryIds, $elasticCategoryIds);

        try {
            $this->entityManager->getConnection()->beginTransaction();

            // Create and update categories and category configurations
            foreach (array_merge($categoriesToAdd, $categoriesToUpdate) as $categoryId) {
                $categoryDoc = $elasticCategories[$categoryId];
                $category = $sqlCategories[$categoryId] ?? new Category();
                $category->setId($categoryDoc->getSource()['id']);
                $category->setParentId($categoryDoc->getSource()['parentId'] ?? '');
                $category->setLevel((int) ($categoryDoc->getSource()['level'] ?? 0));
                $category->setPath($categoryDoc->getSource()['path'] ?? '');

                $configuration = $sqlCategoryConfigurations[$categoryId] ?? new Category\Configuration();
                $configuration->setCatalog($localizedCatalog->getCatalog());
                $configuration->setLocalizedCatalog($localizedCatalog);
                $configuration->setCategory($category);
                $configuration->setName($categoryDoc->getSource()['name']);

                $this->save($configuration);
            }

            // Remove unused category configurations
            foreach ($categoryConfigToRemove as $categoryId) {
                $this->delete($sqlCategoryConfigurations[$categoryId]);
            }
            $this->flush();

            foreach ($this->categoryConfigurationRepository->getUnusedCatalogConfig() as $category) {
                $this->delete($category);
            }
            $this->flush();

            foreach ($this->categoryConfigurationRepository->getUnusedGlobalConfig() as $category) {
                $this->delete($category);
            }
            $this->flush();

            foreach ($this->categoryRepository->getUnusedCategory() as $category) {
                $this->delete($category);
            }
            $this->flush();

            $this->entityManager->getConnection()->commit();
        } catch (OptimisticLockException|ORMException|MappingException|Exception $e) {
            $this->entityManager->getConnection()->rollBack();
            throw new SyncCategoryException($e->getMessage());
        }
    }

    /**
     * @return Category[]
     */
    private function getCategoriesInSql(): array
    {
        $categories = [];
        $configurations = $this->categoryRepository->findAll();
        array_walk(
            $configurations,
            function (Category $category) use (&$categories) {
                $categories[$category->getId()] = $category;
            }
        );

        return $categories;
    }

    /**
     * @return Category\Configuration[]
     */
    private function getCategoryConfigurationsInSql(Index $index): array
    {
        $result = [];
        $configurations = $this->categoryConfigurationRepository->findBy(['localizedCatalog' => $index->getCatalog()]);
        array_walk(
            $configurations,
            function (Category\Configuration $categoryConfig) use (&$result) {
                $result[$categoryConfig->getCategory()->getId()] = $categoryConfig;
            }
        );

        return $result;
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
            array_walk(
                $data,
                function (Document $category) use (&$elasticCategories) {
                    $elasticCategories[$category->getId()] = $category;
                }
            );
            ++$page;
        } while (\count($data));

        return $elasticCategories;
    }

    /**
     * @throws OptimisticLockException
     * @throws MappingException
     * @throws ORMException
     */
    public function save(Category|Category\Configuration $entity): void
    {
        $this->batchOperation($entity, $this->entityManager->persist(...));
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     * @throws MappingException
     */
    public function delete(Category|Category\Configuration $entity): void
    {
        $this->batchOperation($entity, $this->entityManager->remove(...));
    }

    /**
     * @throws OptimisticLockException
     * @throws ORMException
     * @throws MappingException
     */
    private function batchOperation(Category|Category\Configuration $entity, callable $operation): void
    {
        $operation($entity);
        $this->attachedEntities[] = $entity;
        ++$this->currentBatchSize;
        if ($this->currentBatchSize > self::MAX_SAVE_BATCH_SIZE) {
            $this->flush(); // @codeCoverageIgnore The batch max size will not be reached during testing
        }
    }

    private function flush(): void
    {
        $this->entityManager->flush();
        $this->currentBatchSize = 0;
        foreach ($this->attachedEntities as $entity) {
            $this->entityManager->detach($entity);
        }
        $this->attachedEntities = [];
    }
}
