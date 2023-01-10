<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Metadata\Repository;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Metadata\Model\Metadata;

/**
 * @method Metadata|null find($id, $lockMode = null, $lockVersion = null)
 * @method Metadata|null findOneBy(array $criteria, array $orderBy = null)
 * @method Metadata[]    findAll()
 * @method Metadata[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MetadataRepository extends ServiceEntityRepository
{
    private array $cache;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Metadata::class);
    }

    public function findByEntity(string $entityType): ?Metadata
    {
        if (!isset($this->cache[$entityType])) {
            $metadata = $this->findOneBy(['entity' => $entityType]);
            if (!$metadata) {
                throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
            }
            if (null === $metadata->getEntity()) {
                throw new InvalidArgumentException(sprintf('Entity type [%s] is not defined', $entityType));
            }
            $this->cache[$entityType] = $metadata;
        }

        return $this->cache[$entityType];
    }
}
