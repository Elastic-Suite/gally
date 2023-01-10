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

namespace Gally\Category\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Gally\Catalog\Model\Catalog;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Category\Model\Category;
use Gally\Category\Service\CategoryProductsSortingOptionsProvider;

/**
 * @method Category\Configuration|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category\Configuration|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category\Configuration[]    findAll()
 * @method Category\Configuration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryConfigurationRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        private CategoryProductsSortingOptionsProvider $sortingOptionsProvider,
    ) {
        parent::__construct($registry, Category\Configuration::class);
    }

    /**
     * Get the configuration of a given category for the given context.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    public function findOneMergedByContext(
        Category $category,
        ?Catalog $catalog,
        ?LocalizedCatalog $localizedCatalog
    ): ?Category\Configuration {
        $mergeExpr = $this->getMergeExpr($catalog, $localizedCatalog);

        $queryBuilder = $this->buildMergeQuery($mergeExpr)
            ->addSelect('MAX(lc.name) as name')
            ->where('lc.category = :category')
            ->setParameter('category', $category);
        $this->addContextFilter($queryBuilder, $catalog, $localizedCatalog);
        $results = $queryBuilder->getQuery()->getResult();

        $result = reset($results);
        if (!$result) {
            return null;
        }
        $categoryConfiguration = new Category\Configuration();

        // Api can't return data without IRI, so without id.
        // We need to set 0 id for configuration that not exist yet in db.
        $categoryConfiguration->setId($result['id'] ?: 0);
        $categoryConfiguration->setCategory($category);
        $categoryConfiguration->setCatalog($catalog);
        $categoryConfiguration->setLocalizedCatalog($localizedCatalog);
        $categoryConfiguration->setName($result['name']);
        $categoryConfiguration->setIsVirtual((bool) $result['isVirtual']);
        $categoryConfiguration->setVirtualRule($result['virtualRule']);
        $categoryConfiguration->setDefaultSorting($this->validateDefaultSorting($result['defaultSorting']) ? $result['defaultSorting'] : null);
        $categoryConfiguration->setUseNameInProductSearch((bool) $result['useNameInProductSearch']);
        $categoryConfiguration->setIsActive((bool) $result['isActive']);

        return $categoryConfiguration;
    }

    /**
     * Get category configurations for given context.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    public function findMergedByContext(?Catalog $catalog, ?LocalizedCatalog $localizedCatalog): array
    {
        return $this->getFindMergedByContextQueryBuilder($catalog, $localizedCatalog)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get category configurations for given context and categories.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     *
     * @param Category[] $categories
     */
    public function findMergedByContextAndCategories(Catalog $catalog, LocalizedCatalog $localizedCatalog, array $categories): array
    {
        $queryBuilder = $this->getFindMergedByContextQueryBuilder($catalog, $localizedCatalog);

        return $queryBuilder->andWhere('lc.category IN (:categories)')
            ->setParameter('categories', $categories)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get category configurations for given context and category path.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    public function findMergedByContextAndCategoryPath(Catalog $catalog, LocalizedCatalog $localizedCatalog, Category $rootCategory = null): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();
        $queryBuilder = $this->getFindMergedByContextQueryBuilder($catalog, $localizedCatalog);

        $queryBuilder->leftJoin(
            Category::class,
            'category',
            Join::WITH,
            $exprBuilder->andX(
                $exprBuilder->eq('category', 'lc.category'),
            )
        );

        $queryBuilder->andWhere($exprBuilder->like('category.path', $exprBuilder->concat(':rootCategory', "'/%'")))
            ->setParameter('rootCategory', $rootCategory->getPath());

        return $queryBuilder->getQuery()
            ->getResult();
    }

    /**
     * Get category configurations for given context.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    protected function getFindMergedByContextQueryBuilder(?Catalog $catalog, ?LocalizedCatalog $localizedCatalog): QueryBuilder
    {
        $mergeExpr = $this->getMergeExpr($catalog, $localizedCatalog);
        $queryBuilder = $this->buildMergeQuery($mergeExpr)->addSelect('MAX(lc.name) as name');
        $this->addContextFilter($queryBuilder, $catalog, $localizedCatalog);

        return $queryBuilder;
    }

    /**
     * Get all category configurations.
     * The given localized catalog is used to get the default name for these categories.
     */
    public function findAllMerged(LocalizedCatalog $localizedCatalog): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->buildMergeQuery('g.%1$s')
            ->leftJoin(
                $this->getClassName(),
                'defaultName',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('defaultName.category', 'lc.category'),
                    $exprBuilder->eq('defaultName.localizedCatalog', ':localizedCatalogForName'),
                )
            )
            ->andWhere($exprBuilder->isNotNull('lc.localizedCatalog'))
            ->andWhere($exprBuilder->isNotNull('lc.catalog'))
            ->addSelect('MAX(case when defaultName.name is not null then defaultName.name else lc.name end) as name')
            ->setParameter('localizedCatalogForName', $localizedCatalog)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Category\Configuration[]
     */
    public function getUnusedCatalogConfig(): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        $unusedConfiguration = $this->createQueryBuilder('catalog_conf')
            ->where($exprBuilder->isNotNull('catalog_conf.catalog'))
            ->andWhere($exprBuilder->isNull('catalog_conf.localizedCatalog'))
            ->andWhere(
                $exprBuilder->notIn(
                    'catalog_conf.category',
                    $this->getEntityManager()
                        ->createQueryBuilder()
                        ->select('category')
                        ->from(Category::class, 'category')
                        ->join(
                            $this->getClassName(),
                            'localized_catalog_conf',
                            Join::WITH,
                            $exprBuilder->eq('category', 'localized_catalog_conf.category')
                        )
                        ->where($exprBuilder->isNotNull('localized_catalog_conf.localizedCatalog'))
                        ->andWhere($exprBuilder->eq('localized_catalog_conf.catalog', 'catalog_conf.catalog'))
                        ->distinct()
                        ->getDQL()
                )
            )
            ->distinct();

        return $unusedConfiguration->getQuery()->getResult();
    }

    /**
     * @return Category\Configuration[]
     */
    public function getUnusedGlobalConfig(): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        $unusedConfiguration = $this->createQueryBuilder('catalog_conf')
            ->where($exprBuilder->isNull('catalog_conf.catalog'))
            ->andWhere(
                $exprBuilder->notIn(
                    'catalog_conf.category',
                    $this->getEntityManager()
                        ->createQueryBuilder()
                        ->select('category')
                        ->from(Category::class, 'category')
                        ->join(
                            $this->getClassName(),
                            'localized_catalog_conf',
                            Join::WITH,
                            $exprBuilder->eq('category', 'localized_catalog_conf.category')
                        )
                        ->where($exprBuilder->isNotNull('localized_catalog_conf.catalog'))
                        ->distinct()
                        ->getDQL()
                )
            )
            ->distinct();

        return $unusedConfiguration->getQuery()->getResult();
    }

    private function getMergeExpr(?Catalog $catalog, ?LocalizedCatalog $localizedCatalog): string
    {
        if ($localizedCatalog) {
            return 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
                '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end';
        }
        if ($catalog) {
            return 'case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end';
        }

        return 'g.%1$s';
    }

    private function buildMergeQuery(string $mergeExpr): QueryBuilder
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->createQueryBuilder('lc')
            ->resetDQLPart('select')
            // We need to aggregate select field in order to group row on category id.
            // But in doctrine we don't have access on postgres 'DISTINCT ON' or BOOL_AND or IF function
            // So we have to cast our bool value in int in order to aggregate them.
            ->select(
                [
                    'MAX(IDENTITY(lc.category)) as category_id',
                    'MAX(CASE WHEN ' . sprintf($mergeExpr, 'isVirtual') . ' = TRUE THEN 1 ELSE 0 END) as isVirtual',
                    'MAX(' . sprintf($mergeExpr, 'virtualRule') . ') as virtualRule',
                    'MAX(CASE WHEN ' . sprintf($mergeExpr, 'useNameInProductSearch') . ' = FALSE THEN 0 ELSE 1 END) as useNameInProductSearch',
                    'MAX(' . sprintf($mergeExpr, 'defaultSorting') . ') as defaultSorting',
                    'MAX(CASE WHEN lc.isActive = TRUE THEN 1 ELSE 0 END) as isActive',
                ]
            )
            ->leftJoin(
                $this->getClassName(),
                'c',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('c.category', 'lc.category'),
                    $exprBuilder->eq('c.catalog', 'lc.catalog'),
                    $exprBuilder->isNull('c.localizedCatalog'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'g',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('g.category', 'lc.category'),
                    $exprBuilder->isNull('g.catalog'),
                    $exprBuilder->isNull('g.localizedCatalog'),
                )
            )
            ->groupBy('lc.category')
            ->orderBy('lc.category');
    }

    private function addContextFilter(QueryBuilder $queryBuilder, ?Catalog $catalog, ?LocalizedCatalog $localizedCatalog)
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        if ($catalog) {
            $queryBuilder->addSelect('MAX(' . ($localizedCatalog ? 'lc.id' : 'c.id') . ') as id')
                ->andWhere('lc.localizedCatalog = :localizedCatalog')
                ->andWhere('lc.catalog = :catalog')
                ->setParameter('catalog', $catalog);
            $queryBuilder->setParameter('localizedCatalog', $localizedCatalog ?: $catalog->getLocalizedCatalogs()->first());
        } else {
            $queryBuilder->addSelect('MAX(g.id) as id')
                ->andWhere($exprBuilder->isNotNull('lc.localizedCatalog'))
                ->andWhere($exprBuilder->isNotNull('lc.catalog'));
        }
    }

    /**
     * Check if defaultSorting option is valid to avoid error if the sourceField is not sortable anymore.
     */
    private function validateDefaultSorting(?string $sortingOption): bool
    {
        if (!$sortingOption) {
            return true;
        }

        foreach ($this->sortingOptionsProvider->getAllSortingOptions() as $sortingData) {
            if ($sortingData['code'] === $sortingOption) {
                return true;
            }
        }

        return false;
    }
}
