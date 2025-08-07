<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\UserData;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserData>
 */
final class UserDataRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserData::class);
    }

    /**
     * @param string[] $emails
     *
     * @return UserData[]
     */
    public function findByEmails(array $emails): array
    {
        if (!$emails) {
            return [];
        }

        return $this->createQueryBuilder('user_data')
            ->join('user_data.user', 'user')
            ->where('user.email in (:emails)')
            ->orderBy('user.id', 'ASC')
            ->setParameter('emails', $emails)
            ->getQuery()
            ->getResult();
    }
}
