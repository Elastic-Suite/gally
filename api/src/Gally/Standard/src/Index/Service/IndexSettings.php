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

namespace Gally\Index\Service;

use Gally\Analysis\Service\Config;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Index\Api\IndexSettingsInterface;
use Gally\Index\Helper\IndexSettings as IndexSettingsHelper;
use Gally\Index\Model\Index;

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
    public function getIndexAliasFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $localizedCatalog): string
    {
        return $this->indexSettingsHelper->getIndexAliasFromIdentifier($indexIdentifier, $localizedCatalog);
    }

    /**
     * {@inheritDoc}
     */
    public function createIndexNameFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $localizedCatalog): string
    {
        return $this->indexSettingsHelper->createIndexNameFromIdentifier($indexIdentifier, $localizedCatalog);
    }

    /**
     * {@inheritDoc}
     */
    public function getNewIndexMetadataAliases(string $indexIdentifier, LocalizedCatalog|int|string $localizedCatalog): array
    {
        return $this->indexSettingsHelper->getNewIndexMetadataAliases($indexIdentifier, $localizedCatalog);
    }

    /**
     * {@inheritDoc}
     */
    public function getAnalysisSettings(LocalizedCatalog|int|string $localizedCatalog): array
    {
        $language = explode('_', $localizedCatalog->getLocale())[0];

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
    public function getDynamicIndexSettings(LocalizedCatalog|int|string $localizedCatalog): array
    {
        $settings = [];
        $analysisSettings = $this->getAnalysisSettings($localizedCatalog);

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
