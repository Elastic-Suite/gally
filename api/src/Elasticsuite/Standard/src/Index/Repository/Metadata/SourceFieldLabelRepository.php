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

namespace Elasticsuite\Index\Repository\Metadata;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Index\Model\SourceFieldLabel;

/**
 * @method SourceFieldLabel|null find($id, $lockMode = null, $lockVersion = null)
 * @method SourceFieldLabel|null findOneBy(array $criteria, array $orderBy = null)
 * @method SourceFieldLabel[]    findAll()
 * @method SourceFieldLabel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SourceFieldLabelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SourceFieldLabel::class);
    }
}
