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
use Elasticsuite\Index\Api\IndexSettingsInterface;
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
    public function getNewIndexMetadataAliases(string $indexIdentifier, LocalizedCatalog|int|string $catalog): array
    {
        return $this->indexSettingsHelper->getNewIndexMetadataAliases($indexIdentifier, $catalog);
    }

    /**
     * {@inheritDoc}
     */
    public function getAnalysisSettings(LocalizedCatalog|int|string $catalog): array
    {
        // TODO: Implement getAnalysisSettings() method.
        return [
            'filter' => [
                'stemmer' => [
                    'type' => 'stemmer',
                    'language' => 'english',
                ],
                'phonetic' => [
                    'type' => 'phonetic',
                    'encoder' => 'metaphone',
                ],
                'lowercase' => [
                    'type' => 'lowercase',
                ],
                'trim' => [
                    'type' => 'trim',
                ],
                'reference_word_delimiter' => [
                    'split_on_numerics' => 'true',
                    'generate_word_parts' => 'true',
                    'preserve_original' => 'false',
                    'catenate_words' => 'false',
                    'catenate_all' => 'false',
                    'split_on_case_change' => 'true',
                    'type' => 'word_delimiter',
                    'catenate_numbers' => 'false',
                ],
                'ascii_folding' => [
                    'type' => 'asciifolding',
                    'preserve_original' => 'false',
                ],
                'shingle' => [
                    'max_shingle_size' => '2',
                    'min_shingle_size' => '2',
                    'output_unigrams' => 'true',
                    'type' => 'shingle',
                ],
                'truncate_to_max' => [
                    'length' => '8192',
                    'type' => 'truncate',
                ],
                'reference_shingle' => [
                    'max_shingle_size' => '10',
                    'min_shingle_size' => '2',
                    'token_separator' => '',
                    'output_unigrams' => 'true',
                    'type' => 'shingle',
                ],
                'word_delimiter' => [
                    'split_on_numerics' => 'true',
                    'generate_word_parts' => 'true',
                    'preserve_original' => 'true',
                    'catenate_words' => 'true',
                    'catenate_all' => 'true',
                    'split_on_case_change' => 'true',
                    'type' => 'word_delimiter',
                    'catenate_numbers' => 'true',
                ],
            ],
            'analyzer' => [
                'reference' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'reference_word_delimiter',
                        'lowercase',
                        'reference_shingle',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'standard',
                ],
                'standard' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'word_delimiter',
                        'lowercase',
                        'stemmer',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'standard',
                ],
                'phonetic' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'word_delimiter',
                        'lowercase',
                        'phonetic',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'standard',
                ],
                'shingle' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'word_delimiter',
                        'lowercase',
                        'shingle',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'whitespace',
                ],
                'sortable' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'lowercase',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'keyword',
                ],
                'keyword' => [
                    'filter' => [
                        'truncate_to_max',
                    ],
                    'char_filter' => [
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'keyword',
                ],
                'whitespace' => [
                    'filter' => [
                        'ascii_folding',
                        'trim',
                        'word_delimiter',
                        'lowercase',
                    ],
                    'char_filter' => [
                        'html_strip',
                    ],
                    'type' => 'custom',
                    'tokenizer' => 'standard',
                ],
            ],
            'char_filter' => [
                'html_strip' => [
                    'type' => 'html_strip',
                ],
            ],
        ];
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
