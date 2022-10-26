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

namespace Elasticsuite\Category\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Model\Category;

/**
 * @method Category\Configuration|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category\Configuration|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category\Configuration[]    findAll()
 * @method Category\Configuration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryConfigurationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
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
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        if ($localizedCatalog) {
            $mergeExpr = 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
                '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end';
        } elseif ($catalog) {
            $mergeExpr = 'case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end';
        } else {
            $mergeExpr = 'g.%1$s';
        }

        $queryBuilder = $this->buildMergeQuery($mergeExpr)
            ->addSelect('MAX(lc.name) as name')
            ->where('lc.category = :category')
            ->setParameter('category', $category);

        if ($catalog) {
            $queryBuilder->addSelect('MAX(' . ($localizedCatalog ? 'lc.id' : 'c.id') . ') as id')
                ->andWhere('lc.localizedCatalog = :localizedCatalog')
                ->andWhere('lc.catalog = :catalog')
                ->setParameter('catalog', $catalog);
            $localizedCatalog = $localizedCatalog ?: $catalog->getLocalizedCatalogs()->first();
            $queryBuilder->setParameter('localizedCatalog', $localizedCatalog);
        } else {
            $queryBuilder->addSelect('MAX(g.id) as id')
                ->andWhere($exprBuilder->isNotNull('lc.localizedCatalog'))
                ->andWhere($exprBuilder->isNotNull('lc.catalog'));
        }

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
        $categoryConfiguration->setDefaultSorting($result['defaultSorting']);
        $categoryConfiguration->setUseNameInProductSearch((bool) $result['useNameInProductSearch']);
        $categoryConfiguration->setIsActive((bool) $result['isActive']);

        return $categoryConfiguration;
    }

    /**
     * Get category configurations for given context.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    public function findMergedByContext(Catalog $catalog, LocalizedCatalog $localizedCatalog): array
    {
        $mergeExpr = 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
            '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end';

        return $this->buildMergeQuery($mergeExpr)
            ->addSelect('MAX(lc.name) as name')
            ->where('lc.localizedCatalog = :localizedCatalog')
            ->andWhere('lc.catalog = :catalog')
            ->setParameter('catalog', $catalog)
            ->setParameter('localizedCatalog', $localizedCatalog)
            ->getQuery()
            ->getResult();
    }

    /**
     * Get all category configurations.
     * The given localized catalog is used to get the default name for these categories.
     */
    public function findAllMerged(LocalizedCatalog $localizedCatalog): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();
        $mergeExpr = 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
            '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end';

        return $this->buildMergeQuery($mergeExpr)
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
                    'MAX(CASE WHEN ' . sprintf($mergeExpr, 'useNameInProductSearch') . ' = TRUE THEN 1 ELSE 0 END) as useNameInProductSearch',
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
}
