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

namespace Elasticsuite\Index\Api;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Model\Index;

interface IndexSettingsInterface
{
    /**
     * Returns the index alias for an identifier (eg. product) by catalog.
     *
     * @param string                      $indexIdentifier Index identifier
     * @param int|string|LocalizedCatalog $catalog         The catalog
     */
    public function getIndexAliasFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $catalog): string;

    /**
     * Create a new index for an identifier (eg. product) by catalog including current date.
     *
     * @param string                      $indexIdentifier Index identifier
     * @param int|string|LocalizedCatalog $catalog         The catalog
     */
    public function createIndexNameFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $catalog): string;

    /**
     * Return the index aliases to set to a newly created index for an identifier (eg. product) by catalog.
     *
     * @param string                      $indexIdentifier An index identifier
     * @param LocalizedCatalog|int|string $catalog         Catalog
     *
     * @return string[]
     */
    public function getNewIndexMetadataAliases(string $indexIdentifier, LocalizedCatalog|int|string $catalog): array;

    /**
     * Load analysis settings by catalog.
     *
     * @param int|string|LocalizedCatalog $catalog The catalog
     *
     * @return array<mixed>
     */
    public function getAnalysisSettings(LocalizedCatalog|int|string $catalog): array;

    /**
     * Returns settings used during index creation.
     *
     * @return array<mixed>
     */
    public function getCreateIndexSettings(): array;

    /**
     * Returns settings used when installing an index.
     *
     * @return array<mixed>
     */
    public function getInstallIndexSettings(): array;

    /**
     * Returns the list of the available indices declared in elasticsuite_indices.xml.
     *
     * @return array<mixed>
     */
    public function getIndicesConfig(): array;

    /**
     * Return config of an index.
     *
     * @param string $indexIdentifier index identifier
     *
     * @return array<mixed>
     */
    public function getIndexConfig(string $indexIdentifier): array;

    /**
     * Get indexing batch size configured.
     */
    public function getBatchIndexingSize(): int;

    /**
     * Get dynamic index settings per catalog (language).
     *
     * @param int|string|LocalizedCatalog $catalog Catalog
     *
     * @return array<mixed>
     */
    public function getDynamicIndexSettings(LocalizedCatalog|int|string $catalog): array;

    /**
     * Extract original entity from index metadata aliases.
     */
    public function extractEntityFromAliases(Index $index): ?string;

    /**
     * Extract original catalog id from index metadata aliases.
     *
     * @throws \Exception
     */
    public function extractCatalogFromAliases(Index $index): ?LocalizedCatalog;

    /**
     * Check if index name follow the naming convention.
     */
    public function isInternal(Index $index): bool;

    /**
     * Check if index has been installed.
     */
    public function isInstalled(Index $index): bool;

    /**
     * Check if index is obsolete.
     */
    public function isObsolete(Index $index): bool;
}
