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

namespace Elasticsuite\Catalog\Repository;

use ApiPlatform\Core\Exception\InvalidArgumentException;
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
    private array $cache;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, LocalizedCatalog::class);
    }

    public function unsetDefaultLocalizedCatalog(): void
    {
        $this->createQueryBuilder('')
            ->update(LocalizedCatalog::class, 'lc')
            ->set('lc.isDefault', ':isDefault')
            ->setParameter('isDefault', false)
            ->getQuery()
            ->execute();
    }

    public function findByCodeOrId(int|string $identifier): ?LocalizedCatalog
    {
        if (!isset($this->cache[$identifier])) {
            if (is_numeric($identifier)) {
                $catalog = $this->find($identifier);
            } else {
                $catalog = $this->findOneBy(['code' => $identifier]);
            }
            if (null === $catalog) {
                throw new InvalidArgumentException(sprintf('Missing catalog [%s]', $identifier));
            }
            $this->cache[$identifier] = $catalog;
        }

        return $this->cache[$identifier];
    }
}
