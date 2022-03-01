<?php

namespace Elasticsuite\Catalog\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Catalog\Model\LocalizedCatalog;

/**
 * @method LocalizedCatalog|null find($id, $lockMode = null, $lockVersion = null)
 * @method LocalizedCatalog|null findOneBy(array $criteria, array $orderBy = null)
 * @method LocalizedCatalog[]    findAll()
 * @method LocalizedCatalog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LocalizedCatalogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LocalizedCatalog::class);
    }
}
