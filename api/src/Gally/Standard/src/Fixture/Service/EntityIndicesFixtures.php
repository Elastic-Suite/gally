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

namespace Gally\Fixture\Service;

use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Index\Api\IndexSettingsInterface;
use Gally\Index\Repository\Index\IndexRepositoryInterface;
use Gally\Index\Service\IndexOperation;
use Gally\Metadata\Repository\MetadataRepository;

class EntityIndicesFixtures implements EntityIndicesFixturesInterface
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private IndexOperation $indexOperation,
        private IndexRepositoryInterface $indexRepository,
        private IndexSettingsInterface $indexSettings,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function createEntityElasticsearchIndices(string $entityType, int|string|null $localizedCatalogIdentifier = null): void
    {
        $metadata = $this->metadataRepository->findByEntity($entityType);
        $localizedCatalogs = $this->getLocalizedCatalogs($localizedCatalogIdentifier);

        foreach ($localizedCatalogs as $catalog) {
            $index = $this->indexOperation->createIndex($metadata, $catalog);
            $this->indexOperation->installIndexByName($index->getName());
        }
    }

    /**
     * {@inheritDoc}
     */
    public function deleteEntityElasticsearchIndices(string $entityType, int|string|null $localizedCatalogIdentifier = null): void
    {
        $metadata = $this->metadataRepository->findByEntity($entityType);
        $localizedCatalogs = $this->getLocalizedCatalogs($localizedCatalogIdentifier);

        foreach ($localizedCatalogs as $catalog) {
            $index = $this->indexRepository->findByName(
                $this->indexSettings->getIndexAliasFromIdentifier(
                    $metadata->getEntity(),
                    $catalog->getId()
                )
            );
            $this->indexRepository->delete($index->getName());
        }
    }

    /**
     * Get all localized catalogs or a specific one based on an identifier.
     *
     * @param int|string|null $localizedCatalogIdentifier Catalog identifier (code or id)
     *
     * @return LocalizedCatalog[]
     */
    private function getLocalizedCatalogs(int|string|null $localizedCatalogIdentifier = null): array
    {
        $localizedCatalogs = [];

        if (null !== $localizedCatalogIdentifier) {
            $localizedCatalogs[] = $this->localizedCatalogRepository->findByCodeOrId($localizedCatalogIdentifier);
        } else {
            $localizedCatalogs = $this->localizedCatalogRepository->findAll();
        }

        return $localizedCatalogs;
    }
}
