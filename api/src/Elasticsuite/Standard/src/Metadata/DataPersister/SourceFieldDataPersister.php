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

namespace Elasticsuite\Metadata\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\Metadata\Model\SourceField;

class SourceFieldDataPersister implements DataPersisterInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data): bool
    {
        return $data instanceof SourceField;
    }

    /**
     * {@inheritdoc}
     *
     * @param SourceField $data
     *
     * @return SourceField
     */
    public function persist($data)
    {
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }

    /**
     * {@inheritdoc}
     *
     * @param SourceField $data
     */
    public function remove($data)
    {
        // Prevent user to delete system source fields
        if ($data->getIsSystem()) {
            throw new InvalidArgumentException('You can`t remove system source field');
        }

        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
