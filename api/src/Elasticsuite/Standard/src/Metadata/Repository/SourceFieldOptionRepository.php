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

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Metadata\Model\SourceFieldOption;

/**
 * @method SourceFieldOption|null find($id, $lockMode = null, $lockVersion = null)
 * @method SourceFieldOption|null findOneBy(array $criteria, array $orderBy = null)
 * @method SourceFieldOption[]    findAll()
 * @method SourceFieldOption[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SourceFieldOptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SourceFieldOption::class);
    }
}
