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

namespace Elasticsuite\Index\Service;

use Elasticsuite\Analysis\Service\Config;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Helper\IndexSettings as IndexSettingsHelper;
use Elasticsuite\Index\Model\Index;

class IndexSettings implements IndexSettingsInterface
{
    /**
     * IndexSettings constructor.
     *
     * @param IndexSettingsHelper $indexSettingsHelper Index settings helper
     */
    public function __construct(
        private IndexSettingsHelper $indexSettingsHelper,
        private Config $analysisConfig,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function getIndexAliasFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $catalog): string
    {
        return $this->indexSettingsHelper->getIndexAliasFromIdentifier($indexIdentifier, $catalog);
    }

    /**
     * {@inheritDoc}
     */
    public function createIndexNameFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $catalog): string
    {
        return $this->indexSettingsHelper->createIndexNameFromIdentifier($indexIdentifier, $catalog);
    }

    /**
     * {@inheritDoc}
     */
    public function getNewIndexMetadataAliases(string $indexIdentifier, LocalizedCatalog|int|string $catalog): array
    {
        return $this->indexSettingsHelper->getNewIndexMetadataAliases($indexIdentifier, $catalog);
    }

    /**
     * {@inheritDoc}
     */
    public function getAnalysisSettings(LocalizedCatalog|int|string $catalog): array
    {
        $language = explode('_', $catalog->getLocale())[0];

        return $this->analysisConfig->get($language);
    }

    /**
     * {@inheritDoc}
     */
    public function getCreateIndexSettings(): array
    {
        return $this->indexSettingsHelper->getCreateIndexSettings();
    }

    /**
     * {@inheritDoc}
     */
    public function getInstallIndexSettings(): array
    {
        return $this->indexSettingsHelper->getInstallIndexSettings();
    }

    /**
     * {@inheritDoc}
     */
    public function getIndicesConfig(): array
    {
        // TODO: Implement getIndicesConfig() method.
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getIndexConfig(string $indexIdentifier): array
    {
        // TODO: Implement getIndexConfig() method.
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getBatchIndexingSize(): int
    {
        return $this->indexSettingsHelper->getBatchIndexingSize();
    }

    /**
     * {@inheritDoc}
     */
    public function getDynamicIndexSettings(LocalizedCatalog|int|string $catalog): array
    {
        $settings = [];
        $analysisSettings = $this->getAnalysisSettings($catalog);

        $shingleDiff = $this->indexSettingsHelper->getMaxShingleDiff($analysisSettings);
        $ngramDiff = $this->indexSettingsHelper->getMaxNgramDiff($analysisSettings);

        $settings += $shingleDiff ? ['max_shingle_diff' => (int) $shingleDiff] : [];
        $settings += $ngramDiff ? ['max_ngram_diff' => (int) $ngramDiff] : [];

        return $settings;
    }

    /**
     * {@inheritDoc}
     */
    public function extractEntityFromAliases(Index $index): ?string
    {
        return $this->indexSettingsHelper->extractEntityFromAliases($index);
    }

    /**
     * {@inheritDoc}
     */
    public function extractCatalogFromAliases(Index $index): ?LocalizedCatalog
    {
        return $this->indexSettingsHelper->extractCatalogFromAliases($index);
    }

    /**
     * {@inheritDoc}
     */
    public function isInternal(Index $index): bool
    {
        return $this->indexSettingsHelper->isInternal($index);
    }

    /**
     * {@inheritDoc}
     */
    public function isInstalled(Index $index): bool
    {
        return $this->indexSettingsHelper->isInstalled($index);
    }

    /**
     * {@inheritDoc}
     */
    public function isObsolete(Index $index): bool
    {
        return $this->indexSettingsHelper->isObsolete($index);
    }
}
