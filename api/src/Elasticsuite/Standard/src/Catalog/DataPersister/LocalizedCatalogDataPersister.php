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

namespace Elasticsuite\Catalog\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;

class LocalizedCatalogDataPersister implements DataPersisterInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private LocalizedCatalogRepository $localizedCatalogRepository
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data): bool
    {
        return $data instanceof LocalizedCatalog;
    }

    /**
     * {@inheritdoc}
     *
     * @param LocalizedCatalog $data
     *
     * @return LocalizedCatalog
     */
    public function persist($data)
    {
        if ($data->getIsDefault()) {
            $this->localizedCatalogRepository->unsetDefaultLocalizedCatalog();
        }
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }

    /**
     * {@inheritdoc}
     *
     * @param LocalizedCatalog $data
     */
    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
