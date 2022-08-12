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

    public function findByContext(string $categoryId, ?int $catalogId, ?int $localizedCatalogId): ?Category\Configuration
    {
        return $this->findOneBy(
            ['category' => $categoryId, 'catalog' => $catalogId, 'localizedCatalog' => $localizedCatalogId]
        );
    }

    public function findMergedConfigurationByContext(Catalog $catalog, LocalizedCatalog $localizedCatalog): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        $conditionExpr = 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
            '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end as %1$s';

        return $this->createQueryBuilder('lc')
            ->resetDQLPart('select')
            ->select(
                [
                    'lc.name',
                    'IDENTITY(lc.category) as category_id',
                    sprintf($conditionExpr, 'isVirtual'),
                    sprintf($conditionExpr, 'useNameInProductSearch'),
                    sprintf($conditionExpr, 'defaultSorting'),
                    'lc.isActive',
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
                    $exprBuilder->isNull('c.localizedCatalog'),
                )
            )
            // Is null catalog | localized catalog
            ->where('lc.localizedCatalog = :localizedCatalog')
            ->andWhere('lc.catalog = :catalog')
            ->setParameter('catalog', $catalog)
            ->setParameter('localizedCatalog', $localizedCatalog)
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
}
