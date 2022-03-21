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

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Helper\IndexSettings as IndexSettingsHelper;

class IndexSettings implements IndexSettingsInterface
{
    /**
     * IndexSettings constructor.
     *
     * @param IndexSettingsHelper $indexSettingsHelper Index settings helper
     */
    public function __construct(
        private IndexSettingsHelper $indexSettingsHelper
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
    public function getAnalysisSettings(LocalizedCatalog|int|string $catalog): array
    {
        // TODO: Implement getAnalysisSettings() method.
        return [];
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
}
