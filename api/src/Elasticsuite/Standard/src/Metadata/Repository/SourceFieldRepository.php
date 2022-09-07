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

namespace Elasticsuite\Metadata\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Metadata\Model\SourceField;

/**
 * @method SourceField|null find($id, $lockMode = null, $lockVersion = null)
 * @method SourceField|null findOneBy(array $criteria, array $orderBy = null)
 * @method SourceField[]    findAll()
 * @method SourceField[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SourceFieldRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, private MetadataRepository $metadataRepository)
    {
        parent::__construct($registry, SourceField::class);
    }

    /**
     * @return SourceField[]
     */
    public function getSortableFields(string $entityCode): array
    {
        return $this->findBy(
            [
                'metadata' => $this->metadataRepository->findBy(['entity' => $entityCode]),
                'isSortable' => true,
            ]
        );
    }

    /**
     * @return SourceField[]
     */
    public function getFilterableInRequestFields(string $entityCode): array
    {
        $exprBuilder = $this->getEntityManager()->getExpressionBuilder();

        $query = $this->createQueryBuilder('o')
            ->where('o.metadata = :metadata')
            ->andWhere(
                $exprBuilder->orX(
                    $exprBuilder->eq('o.isFilterable', 'true'),
                    $exprBuilder->eq('o.isUsedForRules', 'true'),
                )
            )
            ->setParameter('metadata', $this->metadataRepository->findOneBy(['entity' => $entityCode]))
            ->getQuery();

        return $query->getResult();
    }
}
