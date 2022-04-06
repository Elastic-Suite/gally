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
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright {2022} Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

namespace Elasticsuite\Index\Service;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Exception\LogicException;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Model\Metadata;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class IndexOperation
{
    public function __construct(
        private IndexRepositoryInterface $indexRepository,
        private IndexSettingsInterface $indexSettings,
        private IndexManager $indexManager
    ) {
    }

    /**
     * Creates an index for a given entity metadata and catalog.
     *
     * @param Metadata                    $metadata Entity metadata
     * @param int|string|LocalizedCatalog $catalog  Catalog
     */
    public function createIndex(Metadata $metadata, LocalizedCatalog|int|string $catalog): Index
    {
        if (null === $metadata->getEntity()) {
            throw new LogicException('Invalid metadata: no entity');
        }

        $indexSettings = [
            'settings' => $this->indexSettings->getCreateIndexSettings() + $this->indexSettings->getDynamicIndexSettings($catalog),
        ];
        $indexSettings['settings']['analysis'] = $this->indexSettings->getAnalysisSettings($catalog);
        $indexSettings['mappings'] = $this->indexManager->getMapping($metadata)->asArray();
        $newIndexAliases = $this->indexSettings->getNewIndexMetadataAliases($metadata->getEntity(), $catalog);
        if (!empty($newIndexAliases)) {
            $indexSettings['aliases'] = array_fill_keys($newIndexAliases, ['is_hidden' => true]);
        }

        return $this->indexRepository->create(
            $this->indexSettings->createIndexNameFromIdentifier($metadata->getEntity(), $catalog),
            $indexSettings
        );
    }

    /**
     * Install index
     * - apply definitive settings
     * - add the correct index alias while removing it from the older index.
     *
     * @param string $indexName index name
     */
    public function installIndexByName(string $indexName): void
    {
        $this->indexRepository->refresh([$indexName]);
        $this->indexRepository->putSettings($indexName, $this->indexSettings->getInstallIndexSettings());
        $this->indexRepository->forceMerge($indexName);

        $indexAlias = $this->getInstalledIndexAlias($indexName);
        if (!empty($indexAlias)) {
            $this->proceedInstallIndex($indexName, $indexAlias);
        }
        // TODO else throw an error ?
    }

    /**
     * Proceed to the indices install :
     *  1) First switch the alias to the new index
     *  2) Remove old indices.
     *
     * @param string $indexName  Real index name
     * @param string $indexAlias Index alias (must include catalog identifier)
     */
    public function proceedInstallIndex(string $indexName, string $indexAlias): void
    {
        $aliasActions = [];
        $toDeleteIndices = [];

        $aliasActions[] = [
            'add' => ['index' => $indexName, 'alias' => $indexAlias],
        ];
        try {
            $oldIndices = array_keys($this->indexRepository->getMapping($indexAlias));
        } catch (\Elasticsearch\Common\Exceptions\Missing404Exception $e) {
            $oldIndices = [];
        }
        foreach ($oldIndices as $oldIndexName) {
            if ($oldIndexName != $indexName) {
                $toDeleteIndices[] = $oldIndexName;
                $aliasActions[] = ['remove' => ['index' => $oldIndexName, 'alias' => $indexAlias]];
            }
        }

        if (!empty($aliasActions)) {
            $this->indexRepository->updateAliases($aliasActions);
        }

        foreach ($toDeleteIndices as $toDeleteIndex) {
            $this->indexRepository->delete($toDeleteIndex);
        }
    }

    /**
     * Return the index alias to apply to the installed index.
     *
     * @param string $indexName Index name
     */
    protected function getInstalledIndexAlias(string $indexName): string|null
    {
        $installIndexAlias = null;

        $indexMetadataAliases = $this->indexRepository->getIndexAliases($indexName, '.*');
        $entityType = $this->extractEntityFromAliases($indexMetadataAliases);
        $catalogId = $this->extractCatalogIdFromAliases($indexMetadataAliases);
        if (!empty($entityType) && !empty($catalogId)) {
            $installIndexAlias = $this->indexSettings->getIndexAliasFromIdentifier($entityType, $catalogId);
        }

        return $installIndexAlias;
    }

    /**
     * Extract original entity from index metadata aliases.
     *
     * @param string[] $indexMetadataAliases Index metadata aliases
     */
    protected function extractEntityFromAliases(array $indexMetadataAliases): string|null
    {
        $entityType = preg_filter('#^\.entity_(.+)$#', '$1', $indexMetadataAliases, 1);
        if (!empty($entityType)) {
            if (\is_array($entityType)) {
                $entityType = current($entityType);
            }
        }

        return $entityType;
    }

    /**
     * Extract original catalog id from index metadata aliases.
     *
     * @param string[] $indexMetadataAliases Index metadata aliases
     */
    protected function extractCatalogIdFromAliases(array $indexMetadataAliases): int|null
    {
        $catalogId = preg_filter('#^\.catalog_(.+)$#', '$1', $indexMetadataAliases, 1);
        if (!empty($catalogId)) {
            if (\is_array($catalogId)) {
                $catalogId = current($catalogId);
            }
            $catalogId = (int) $catalogId;
        } else {
            $catalogId = null;
        }

        return $catalogId;
    }
}
