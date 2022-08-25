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

namespace Elasticsuite\Fixture\Service;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Index\Service\IndexOperation;
use Elasticsuite\Metadata\Repository\MetadataRepository;

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
