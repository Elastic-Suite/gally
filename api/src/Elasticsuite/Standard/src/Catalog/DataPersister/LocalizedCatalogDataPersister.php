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

        $this->setOneAsDefault();

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

        $this->setOneAsDefault();
    }

    private function setOneAsDefault(): void
    {
        $defaultLocalizedCatalog = $this->localizedCatalogRepository->findOneBy(['isDefault' => true]);
        if (!$defaultLocalizedCatalog) {
            $defaultLocalizedCatalog = $this->localizedCatalogRepository->findOneBy([], ['id' => 'ASC']);
            $defaultLocalizedCatalog->setIsDefault(true);
            $this->entityManager->persist($defaultLocalizedCatalog);
            $this->entityManager->flush();
        }
    }
}
