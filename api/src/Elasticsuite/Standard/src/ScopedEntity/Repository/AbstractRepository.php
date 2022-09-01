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

namespace Elasticsuite\ScopedEntity\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Elasticsuite\ScopedEntity\Model\Scope;

abstract class AbstractRepository extends ServiceEntityRepository
{
    protected function buildScopedQuery(Scope $scope, mixed $parentEntity, string $parentEntityClass, string $parentEntityField): QueryBuilder
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();
        $localizedCatalog = $scope->getLocalizedCatalog();

        if ($localizedCatalog) {
            $mergeExpr = 'case when lc.%1$s IS NOT NULL then lc.%1$s else ' .
                '(case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end) end';
        } elseif ($scope->getCatalog()) {
            $localizedCatalog = $scope->getCatalog()->getLocalizedCatalogs()->first();
            $mergeExpr = 'case when c.%1$s IS NOT NULL then c.%1$s else g.%1$s end';
        } else {
            $mergeExpr = 'g.%1$s';
        }

        $queryBuilder = $this->_em->createQueryBuilder()
            // We need to aggregate select field in order to group row on category id.
            // But in doctrine we don't have access on postgres 'DISTINCT ON' or BOOL_AND or IF function
            // So we have to cast our bool value in int in order to aggregate them.
            ->select(
                [
                    'CONCAT(parent.id, \'\') as category_id',
                    'MAX(CASE WHEN ' . sprintf($mergeExpr, 'isVirtual') . ' = TRUE THEN 1 ELSE 0 END) as isVirtual',
                    'MAX(' . sprintf($mergeExpr, 'id') . ') as id',
                ]
            )
            ->from($parentEntityClass, 'parent')
            ->leftJoin(
                $this->getClassName(),
                'lc',
                Join::WITH,
                $scope->getCatalog()
                    ? $exprBuilder->andX(
                        $exprBuilder->eq('parent', "lc.$parentEntityField"),
                        $exprBuilder->eq('lc.localizedCatalog', ':localizedCatalog'),
                        $exprBuilder->eq('lc.catalog', ':catalog'),
                    )
                    : $exprBuilder->andX(
                        $exprBuilder->eq('parent', "lc.$parentEntityField"),
                        $exprBuilder->isNotNull('lc.localizedCatalog'),
                        $exprBuilder->isNotNull('lc.catalog'),
                    )
            )
            ->leftJoin(
                $this->getClassName(),
                'c',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('parent', "c.$parentEntityField"),
                    $exprBuilder->eq('c.catalog', ':catalog'),
                    $exprBuilder->isNull('c.localizedCatalog'),
                )
            )
            ->leftJoin(
                $this->getClassName(),
                'g',
                Join::WITH,
                $exprBuilder->andX(
                    $exprBuilder->eq('parent', "g.$parentEntityField"),
                    $exprBuilder->isNull('g.catalog'),
                    $exprBuilder->isNull('c.localizedCatalog'),
                )
            )
            ->where('parent.id = :parent_entity')
            ->setParameter('parent_entity', $parentEntity)
            ->groupBy('parent.id')
            ->orderBy('parent.id');

        if ($scope->getCatalog()) {
            $queryBuilder
                ->setParameter('catalog', $scope->getCatalog())
                ->setParameter('localizedCatalog', $localizedCatalog);
        }

        return $queryBuilder;
    }
}
