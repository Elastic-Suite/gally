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
use Doctrine\ORM\Query;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Gally\Catalog\Model\Catalog;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Category\Model\Category;

/**
 * @method Category\ProductMerchandising|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category\ProductMerchandising|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category\ProductMerchandising[]    findAll()
 * @method Category\ProductMerchandising[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryProductMerchandisingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category\ProductMerchandising::class);
    }

    /**
     * @return LocalizedCatalog[]
     */
    public function findLocalizedCatalogsToReindexForCatalogScope(Category\ProductMerchandising $productMerchandising): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->getEntityManager()->createQueryBuilder()
            ->select('lc')
            ->from(LocalizedCatalog::class, 'lc')
            ->leftJoin(
                Category\Configuration::class,
                'cc',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cc.localizedCatalog', 'lc'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'cp',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cp.localizedCatalog', 'lc'),
                    $exprBuilder->eq('cp.catalog', ':catalog'),
                    $exprBuilder->eq('cp.category', ':category'),
                    $exprBuilder->eq('cp.productId', ':productId'),
                )
            )
            ->where('cc.category = :category')
            ->andWhere('lc.catalog = :catalog')
            ->andWhere('cp.localizedCatalog IS NULL')
            ->setParameter('catalog', $productMerchandising->getCatalog())
            ->setParameter('category', $productMerchandising->getCategory())
            ->setParameter('productId', $productMerchandising->getProductId())
            ->getQuery()
            ->getResult();
    }

    /**
     * @return LocalizedCatalog[]
     */
    public function findLocalizedCatalogsToReindexForGlobalScope(Category\ProductMerchandising $productMerchandising): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->getEntityManager()->createQueryBuilder()
            ->select('lc')
            ->from(LocalizedCatalog::class, 'lc')
            ->innerJoin(
                Category\Configuration::class,
                'cc',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cc.localizedCatalog', 'lc'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'cp',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cp.localizedCatalog', 'lc'),
                    $exprBuilder->eq('cp.category', ':category'),
                    $exprBuilder->eq('cp.productId', ':productId'),
                )
            )
            ->where('cc.category = :category')
            ->andWhere('cp.localizedCatalog IS NULL')
            ->setParameter('category', $productMerchandising->getCategory())
            ->setParameter('productId', $productMerchandising->getProductId())
            ->getQuery()
            ->getResult();
    }

    public function findCatalogsByPositionQuery(Category\ProductMerchandising $productMerchandising): Query
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->getEntityManager()->createQueryBuilder()
            ->select('catalog')
            ->from(Catalog::class, 'catalog')
            ->leftJoin(
                Category\ProductMerchandising::class,
                'cp',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cp.catalog', 'catalog'),
                )
            )
            ->where('cp.localizedCatalog IS NULL')
            ->andwhere('cp.category = :category')
            ->andwhere('cp.productId = :productId')
            ->setParameter('category', $productMerchandising->getCategory())
            ->setParameter('productId', $productMerchandising->getProductId())
            ->getQuery();
    }

    public function findCatalogsByPositionAsArray(Category\ProductMerchandising $productMerchandising): array
    {
        return $this->findCatalogsByPositionQuery($productMerchandising)->getArrayResult();
    }

    /**
     * Find products to reindex by localized catalog.
     * The returned array contains all data necessary to reindex positions (product id, category id and position).
     *
     * @param LocalizedCatalog $localizedCatalog Localized catalog
     * @param array<int, int>  $products         Products (allows to limit the scope of the products to return)
     */
    public function findProductsWithDataPositionToReindex(LocalizedCatalog $localizedCatalog, array $products = []): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();
        $mergeExpr = 'case when lc.localizedCatalog IS NOT NULL then lc.%1$s else ' .
            '(case when c.catalog IS NOT NULL then c.%1$s else cpm.%1$s end) end';

        $queryBuilder = $this->buildMergeQuery($mergeExpr)
            ->setParameter('catalog', $localizedCatalog->getCatalog())
            ->setParameter('localizedCatalog', $localizedCatalog);

        if (!empty($products)) {
            $queryBuilder->andWhere(
                $exprBuilder->in(
                    'cpm.productId', $products
                )
            );
        }

        return $queryBuilder->getQuery()
            ->getResult();
    }

    private function buildMergeQuery(string $mergeExpr): QueryBuilder
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->createQueryBuilder('cpm')
            ->resetDQLPart('select')
            ->select(
                [
                    'MAX(IDENTITY(cpm.category)) as category_id',
                    'cpm.productId as product_id',
                    'MAX(' . sprintf($mergeExpr, 'position') . ') as position',
                ]
            )
            ->leftJoin(
                Category\Configuration::class,
                'cc',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('cc.category', 'cpm.category '),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'lc',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('lc.category', 'cpm.category'),
                    $exprBuilder->eq('lc.productId', 'cpm.productId'),
                    $exprBuilder->eq('lc.localizedCatalog', ':localizedCatalog'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'c',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('c.category', 'cpm.category'),
                    $exprBuilder->eq('c.productId', 'cpm.productId'),
                    $exprBuilder->eq('c.catalog', ':catalog'),
                    $exprBuilder->isNull('c.localizedCatalog'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'g',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('g.category', 'cpm.category'),
                    $exprBuilder->eq('g.productId', 'cpm.productId'),
                    $exprBuilder->isNull('g.catalog'),
                    $exprBuilder->isNull('g.localizedCatalog'),
                )
            )
            ->where('cpm.localizedCatalog = :localizedCatalog')
            ->orWhere('cpm.catalog = :catalog AND cpm.localizedCatalog IS NULL')
            ->orWhere('cpm.localizedCatalog IS NULL AND cpm.catalog IS NULL')
            ->andWhere('cc.localizedCatalog = :localizedCatalog')
            ->groupBy('cpm.category')
            ->addGroupBy('cpm.productId')
            ->orderBy('cpm.productId');
    }

    public function removeByProductIdAndLocalizedCatalog(array $productIds, LocalizedCatalog $localizedCatalog): int
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        return $this->createQueryBuilder('cpm')
            ->delete()
            ->where($exprBuilder->in('cpm.productId', $productIds))
            ->andWhere('cpm.localizedCatalog = :localizedCatalog')
            ->setParameter('localizedCatalog', $localizedCatalog)
            ->getQuery()
            ->execute();
    }
}
