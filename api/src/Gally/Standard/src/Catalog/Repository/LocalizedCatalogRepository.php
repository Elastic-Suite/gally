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

namespace Gally\Catalog\Repository;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Gally\Catalog\Model\LocalizedCatalog;

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
                $localizedCatalog = $this->find($identifier);
            } else {
                $localizedCatalog = $this->findOneBy(['code' => $identifier]);
            }
            if (null === $localizedCatalog) {
                throw new InvalidArgumentException(sprintf('Missing localized catalog [%s]', $identifier));
            }
            $this->cache[$identifier] = $localizedCatalog;
        }

        return $this->cache[$identifier];
    }
}
