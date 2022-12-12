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

namespace Elasticsuite\Index\Repository\Index;

use Elasticsearch\Client;
use Elasticsuite\Exception\LogicException;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Dto\Bulk;
use Elasticsuite\Index\Model\Index;
use Exception;

class IndexRepository implements IndexRepositoryInterface
{
    public function __construct(
        private Client $client,
        private IndexSettingsInterface $indexSettings,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function findAll(): array
    {
        $collection = [];
        $aliases = [];
        $indices = $this->client->cat()->indices();

        if (\count($indices) > 0) {
            $aliases = $this->client->cat()->aliases();
        }

        foreach ($indices as $indexData) {
            // @Todo: keep this test to exclude .geoip index or find a way to get _only_ elasticsuite indices.
            if (0 !== strpos($indexData['index'], '.')) {
                $collection[] = $this->getIndex($indexData, $this->extractIndexAliases($aliases, $indexData['index']));
            }
        }

        return $collection;
    }

    /**
     * {@inheritDoc}
     */
    public function findByName(string $indexName): ?Index
    {
        $item = null;
        $index = null;
        try {
            $index = $this->client->cat()->indices(['index' => $indexName]);
        } catch (Exception $e) {
            // Todo: log exception.
        }

        if (\is_array($index) && !empty($index)) {
            $index = reset($index);
            $item = $this->getIndexDetails($index, $this->getIndexAliases($index['index']));
        }

        return $item;
    }

    /**
     * {@inheritDoc}
     */
    public function create(string $indexName, array $settings = [], array $aliases = []): Index
    {
        // Todo: Add logic to validate params and manage errors.
        /*
        $baseSettings = [
            'mapping.total_fields.limit' => '20000',
            'refresh_interval' => '1s',
            'translog.durability' => 'request',
            'max_result_window' => '100000',
            'requests.cache.enable' => 'true',
            'number_of_replicas' => '0',
            'codec' => 'best_compression',
            'number_of_shards' => '1',
            'max_shingle_diff' => '9',
            'merge.scheduler.max_thread_count' => '1',
        ];

        $analysisSettings = [
            'analysis' => [
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
            ],
        ];

        $settings = [
            'settings' => [
                'index' => $baseSettings + $analysisSettings,
            ],
        ];

        $mapping = [
            'mappings' => [
                'properties' => [
                    '_category_name' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    '_stats' => [
                        'properties' => [
                            'conversion_rate' => [
                                'properties' => [
                                    'daily' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'double',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                    'total' => [
                                        'type' => 'double',
                                    ],
                                    'weekly' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'double',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'sales' => [
                                'properties' => [
                                    'daily' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'integer',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                    'total' => [
                                        'type' => 'integer',
                                    ],
                                    'weekly' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'integer',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'views' => [
                                'properties' => [
                                    'daily' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'integer',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                    'total' => [
                                        'type' => 'integer',
                                    ],
                                    'weekly' => [
                                        'properties' => [
                                            'count' => [
                                                'type' => 'integer',
                                            ],
                                            'ma' => [
                                                'type' => 'double',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'activity' => [
                        'type' => 'integer',
                    ],
                    'attribute_set_id' => [
                        'type' => 'integer',
                    ],
                    'autocomplete' => [
                        'type' => 'text',
                        'fields' => [
                            'shingle' => [
                                'type' => 'text',
                                'analyzer' => 'shingle',
                            ],
                            'whitespace' => [
                                'type' => 'text',
                                'analyzer' => 'whitespace',
                            ],
                        ],
                        'analyzer' => 'standard',
                    ],
                    'category' => [
                        'type' => 'nested',
                        'properties' => [
                            'category_id' => [
                                'type' => 'integer',
                            ],
                            'category_uid' => [
                                'type' => 'text',
                                'fields' => [
                                    'untouched' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ],
                                ],
                                'norms' => false,
                                'analyzer' => 'keyword',
                            ],
                            'is_blacklisted' => [
                                'type' => 'boolean',
                            ],
                            'is_parent' => [
                                'type' => 'boolean',
                            ],
                            'is_virtual' => [
                                'type' => 'boolean',
                            ],
                            'name' => [
                                'type' => 'text',
                                'fields' => [
                                    'standard' => [
                                        'type' => 'text',
                                        'analyzer' => 'standard',
                                    ],
                                ],
                                'copy_to' => [
                                    'search',
                                    'spelling',
                                    '_category_name',
                                ],
                                'norms' => false,
                                'analyzer' => 'keyword',
                            ],
                            'position' => [
                                'type' => 'integer',
                            ],
                        ],
                    ],
                    'category_gear' => [
                        'type' => 'integer',
                    ],
                    'children_attributes' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                    'children_ids' => [
                        'type' => 'integer',
                    ],
                    'climate' => [
                        'type' => 'integer',
                    ],
                    'collar' => [
                        'type' => 'integer',
                    ],
                    'color' => [
                        'type' => 'integer',
                    ],
                    'configurable_attributes' => [
                        'type' => 'keyword',
                    ],
                    'created_at' => [
                        'type' => 'date',
                        'format' => 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
                    ],
                    'created_in' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                    'description' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'eco_collection' => [
                        'type' => 'boolean',
                    ],
                    'entity_id' => [
                        'type' => 'integer',
                    ],
                    'erin_recommends' => [
                        'type' => 'boolean',
                    ],
                    'es_is_discounted' => [
                        'type' => 'boolean',
                    ],
                    'es_is_in_stock' => [
                        'type' => 'boolean',
                    ],
                    'features_bags' => [
                        'type' => 'integer',
                    ],
                    'format' => [
                        'type' => 'integer',
                    ],
                    'gender' => [
                        'type' => 'integer',
                    ],
                    'has_options' => [
                        'type' => 'boolean',
                    ],
                    'image' => [
                        'type' => 'text',
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'indexed_attributes' => [
                        'type' => 'keyword',
                    ],
                    'manufacturer' => [
                        'type' => 'integer',
                    ],
                    'material' => [
                        'type' => 'integer',
                    ],
                    'name' => [
                        'type' => 'text',
                        'fields' => [
                            'shingle' => [
                                'type' => 'text',
                                'analyzer' => 'shingle',
                            ],
                            'sortable' => [
                                'type' => 'text',
                                'analyzer' => 'sortable',
                                'fielddata' => true,
                            ],
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                            'whitespace' => [
                                'type' => 'text',
                                'analyzer' => 'whitespace',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'new' => [
                        'type' => 'boolean',
                    ],
                    'option_text_activity' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_category_gear' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_climate' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_collar' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_color' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_eco_collection' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_erin_recommends' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_es_is_discounted' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_es_is_in_stock' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_features_bags' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_format' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_gender' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_manufacturer' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_material' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_new' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_pattern' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_performance_fabric' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_purpose' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_sale' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_size' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_sleeve' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_status' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_strap_bags' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_style_bags' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_style_bottom' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_style_general' => [
                        'type' => 'text',
                        'fields' => [
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'option_text_tax_class_id' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'pattern' => [
                        'type' => 'integer',
                    ],
                    'performance_fabric' => [
                        'type' => 'boolean',
                    ],
                    'price' => [
                        'type' => 'nested',
                        'properties' => [
                            'customer_group_id' => [
                                'type' => 'integer',
                            ],
                            'final_price' => [
                                'type' => 'double',
                            ],
                            'is_discount' => [
                                'type' => 'boolean',
                            ],
                            'max_price' => [
                                'type' => 'double',
                            ],
                            'min_price' => [
                                'type' => 'double',
                            ],
                            'original_price' => [
                                'type' => 'double',
                            ],
                            'price' => [
                                'type' => 'double',
                            ],
                            'tax_class_id' => [
                                'type' => 'integer',
                            ],
                        ],
                    ],
                    'purpose' => [
                        'type' => 'integer',
                    ],
                    'required_options' => [
                        'type' => 'boolean',
                    ],
                    'row_id' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                    'sale' => [
                        'type' => 'boolean',
                    ],
                    'search' => [
                        'type' => 'text',
                        'fields' => [
                            'shingle' => [
                                'type' => 'text',
                                'analyzer' => 'shingle',
                            ],
                            'whitespace' => [
                                'type' => 'text',
                                'analyzer' => 'whitespace',
                            ],
                        ],
                        'analyzer' => 'standard',
                    ],
                    'search_query' => [
                        'type' => 'nested',
                        'properties' => [
                            'is_blacklisted' => [
                                'type' => 'boolean',
                            ],
                            'position' => [
                                'type' => 'integer',
                            ],
                            'query_id' => [
                                'type' => 'integer',
                            ],
                        ],
                    ],
                    'short_description' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'size' => [
                        'type' => 'integer',
                    ],
                    'sku' => [
                        'type' => 'text',
                        'fields' => [
                            'reference' => [
                                'type' => 'text',
                                'analyzer' => 'reference',
                            ],
                            'shingle' => [
                                'type' => 'text',
                                'analyzer' => 'shingle',
                            ],
                            'sortable' => [
                                'type' => 'text',
                                'analyzer' => 'sortable',
                                'fielddata' => true,
                            ],
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                            'whitespace' => [
                                'type' => 'text',
                                'analyzer' => 'whitespace',
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'sleeve' => [
                        'type' => 'integer',
                    ],
                    'spelling' => [
                        'type' => 'text',
                        'fields' => [
                            'phonetic' => [
                                'type' => 'text',
                                'analyzer' => 'phonetic',
                            ],
                            'shingle' => [
                                'type' => 'text',
                                'analyzer' => 'shingle',
                            ],
                            'whitespace' => [
                                'type' => 'text',
                                'analyzer' => 'whitespace',
                            ],
                        ],
                        'analyzer' => 'standard',
                    ],
                    'status' => [
                        'type' => 'integer',
                    ],
                    'stock' => [
                        'properties' => [
                            'is_in_stock' => [
                                'type' => 'boolean',
                            ],
                            'qty' => [
                                'type' => 'integer',
                            ],
                        ],
                    ],
                    'strap_bags' => [
                        'type' => 'integer',
                    ],
                    'style_bags' => [
                        'type' => 'integer',
                    ],
                    'style_bottom' => [
                        'type' => 'integer',
                    ],
                    'style_general' => [
                        'type' => 'integer',
                    ],
                    'tax_class_id' => [
                        'type' => 'integer',
                    ],
                    'type_id' => [
                        'type' => 'keyword',
                    ],
                    'updated_at' => [
                        'type' => 'date',
                        'format' => 'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd',
                    ],
                    'updated_in' => [
                        'type' => 'text',
                        'fields' => [
                            'keyword' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                    ],
                    'url_key' => [
                        'type' => 'text',
                        'fields' => [
                            'standard' => [
                                'type' => 'text',
                                'analyzer' => 'standard',
                            ],
                            'untouched' => [
                                'type' => 'keyword',
                                'ignore_above' => 256,
                            ],
                        ],
                        'copy_to' => [
                            'search',
                            'spelling',
                        ],
                        'norms' => false,
                        'analyzer' => 'keyword',
                    ],
                    'visibility' => [
                        'type' => 'integer',
                    ],
                    'weight' => [
                        'type' => 'double',
                    ],
                ],
            ],
        ];
        */

        $this->client->indices()->create([
            'index' => $indexName,
            'body' => $settings,
        ]);

        if (!empty($aliases)) {
            $this->client->indices()->updateAliases([
                'body' => [
                    'actions' => [[
                        'add' => [
                            'index' => $indexName,
                            'aliases' => $aliases,
                        ],
                    ]],
                ],
            ]);
        }

        $index = $this->findByName($indexName);
        if (null === $index) {
            throw new LogicException('Index [%s] was created but not found');
        }

        return $index;
    }

    /**
     * {@inheritDoc}
     */
    public function bulk(Index $index, Bulk\Request $request): Bulk\Response
    {
        return new Bulk\Response($this->client->bulk(['body' => $request->getOperations()]));
    }

    /**
     * {@inheritDoc}
     */
    public function refresh(array|string $indexName): void
    {
        if (\is_array($indexName)) {
            $indexName = implode(',', $indexName);
        }
        $this->client->indices()->refresh(['index' => $indexName]);
    }

    /**
     * {@inheritDoc}
     */
    public function delete(string $indexName): void
    {
        $this->client->indices()->delete(['index' => $indexName]);
    }

    /**
     * {@inheritDoc}
     */
    public function getIndexAliases(string $indexName, string $alias = '*'): array
    {
        $aliases = $this->client->indices()->getAlias(['name' => $alias, 'index' => $indexName]);
        if (!empty($aliases)) {
            $aliases = $aliases[$indexName]['aliases'] ?? [];
            $aliases = array_keys($aliases);
        }

        return $aliases;
    }

    /**
     * {@inheritDoc}
     */
    public function updateAliases(array $aliasActions): void
    {
        $this->client->indices()->updateAliases(['body' => ['actions' => $aliasActions]]);
    }

    /**
     * {@inheritDoc}
     */
    public function putMapping(array|string $indexName, array $mapping): void
    {
        if (\is_array($indexName)) {
            $indexName = implode(',', $indexName);
        }

        $this->client->indices()->putMapping(['index' => $indexName, 'body' => $mapping]);
    }

    /**
     * {@inheritDoc}
     */
    public function getMapping(array|string $indexName): array
    {
        if (\is_array($indexName)) {
            $indexName = implode(',', $indexName);
        }

        return $this->client->indices()->getMapping(['index' => $indexName]);
    }

    /**
     * {@inheritDoc}
     */
    public function aliasExists(string $alias, string $indexName = null): bool
    {
        return $this->client->indices()->existsAlias(['name' => $alias, 'index' => $indexName]);
    }

    /**
     * {@inheritDoc}
     */
    public function putSettings(string $indexName, array $indexSettings): void
    {
        $this->client->indices()->putSettings(['index' => $indexName, 'body' => $indexSettings]);
    }

    /**
     * {@inheritDoc}
     */
    public function forceMerge(array|string $indexName): void
    {
        if (\is_array($indexName)) {
            $indexName = implode(',', $indexName);
        }
        $this->client->indices()->forcemerge(['index' => $indexName]);
    }

    /**
     * {@inheritDoc}
     */
    public function reindex(string $sourceIndexName, string $destIndexName, bool $asynchronous): array
    {
        return $this->client->reindex([
            'body' => [
                'source' => [
                    'index' => $sourceIndexName,
                ],
                'dest' => [
                    'index' => $destIndexName,
                ],
            ],
            'wait_for_completion' => !$asynchronous,
        ]);
    }

    /**
     * Extract the aliases for a given index.
     *
     * @param array<mixed> $aliases   all index aliases
     * @param string       $indexName index name
     *
     * @return string[]
     */
    private function extractIndexAliases(array $aliases, string $indexName): array
    {
        $indexAliases = [];
        foreach ($aliases as $alias) {
            if ($alias['index'] == $indexName) {
                $indexAliases[] = $alias['alias'];
            }
        }

        return $indexAliases;
    }

    private function getIndex(array $indexData, array $indexAliases): Index
    {
        $index = new Index(
            $indexData['index'],
            $indexAliases,
            (int) $indexData['docs.count'],
            $indexData['store.size'],
        );

        try {
            if (!$this->indexSettings->isInternal($index)) {
                $index->setStatus(Index::STATUS_EXTERNAL);
            } else {
                $index->setEntityType($this->indexSettings->extractEntityFromAliases($index));
                $index->setCatalog($this->indexSettings->extractCatalogFromAliases($index));
                if ($this->indexSettings->isInstalled($index)) {
                    $index->setStatus(Index::STATUS_LIVE);
                } elseif ($this->indexSettings->isObsolete($index)) {
                    $index->setStatus(Index::STATUS_GHOST);
                } else {
                    $index->setStatus(Index::STATUS_INDEXING);
                }
            }
        } catch (Exception) {
            $index->setStatus(Index::STATUS_INVALID);
        }

        return $index;
    }

    private function getIndexDetails(array $indexData, array $indexAliases): Index
    {
        $index = $this->getIndex($indexData, $indexAliases);
        $mapping = [];
        $settings = [];

        try {
            $mapping = $this->client->indices()->getMapping(['index' => $index->getName()]);
            $mapping = $mapping[$index->getName()]['mappings'];
            $settings = $this->client->indices()->getSettings(['index' => $index->getName()]);
            $settings = $settings[$index->getName()]['settings'];
        } catch (Exception $e) {
            // Todo: log exception.
        }

        $index->setMapping($mapping);
        $index->setSettings($settings);

        return $index;
    }
}
