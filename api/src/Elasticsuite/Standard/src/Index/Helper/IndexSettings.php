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

namespace Elasticsuite\Index\Helper;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Model\Index;
use Exception;

class IndexSettings
{
    /**
     * @var string
     */
    public const FULL_REINDEX_REFRESH_INTERVAL = '30s';

    /**
     * @var string
     */
    public const DIFF_REINDEX_REFRESH_INTERVAL = '1s';

    /**
     * @var string
     */
    public const FULL_REINDEX_TRANSLOG_DURABILITY = 'async';

    /**
     * @var string
     */
    public const DIFF_REINDEX_TRANSLOG_DURABILITY = 'request';

    /**
     * @var int
     */
    public const MERGE_FACTOR = 20;

    /**
     * @var string
     */
    public const CODEC = 'best_compression';

    /**
     * @var int
     */
    public const TOTAL_FIELD_LIMIT = 20000;

    /**
     * @var int
     */
    public const PER_SHARD_MAX_RESULT_WINDOW = 100000;

    /**
     * @var int
     */
    public const MIN_SHINGLE_SIZE_DEFAULT = 2;

    /**
     * @var int
     */
    public const MAX_SHINGLE_SIZE_DEFAULT = 2;

    /**
     * @var int
     */
    public const MIN_NGRAM_SIZE_DEFAULT = 1;

    /**
     * @var int
     */
    public const MAX_NGRAM_SIZE_DEFAULT = 2;

    /**
     * IndexSettings constructor.
     *
     * @param LocalizedCatalogRepository $catalogRepository    Catalog repository
     * @param array<mixed>               $indicesConfiguration Indices configuration
     */
    public function __construct(
        private LocalizedCatalogRepository $catalogRepository,
        private array $indicesConfiguration
    ) {
    }

    /**
     * Create a new index name for a given entity/index identifier (eg. product) and catalog including current date.
     *
     * @param string                      $indexIdentifier Index identifier
     * @param int|string|LocalizedCatalog $catalog         The catalog
     */
    public function createIndexNameFromIdentifier(string $indexIdentifier, LocalizedCatalog|int|string $catalog): string
    {
        $indexNameSuffix = $this->getIndexNameSuffix(new \DateTime());

        return sprintf('%s_%s', $this->getIndexAliasFromIdentifier($indexIdentifier, $catalog), $indexNameSuffix);
    }

    /**
     * Returns the index alias for an identifier (eg. product) by catalog.
     *
     * @param string                      $indexIdentifier An index identifier
     * @param int|string|LocalizedCatalog $catalog         The catalog
     */
    public function getIndexAliasFromIdentifier(string $indexIdentifier, int|string|LocalizedCatalog $catalog): string
    {
        $catalogCode = strtolower((string) $this->getCatalogCode($catalog));

        return sprintf('%s_%s_%s', $this->getIndexNamePrefix(), $catalogCode, $indexIdentifier);
    }

    /**
     * Return the index aliases to set to a newly created index for an identifier (eg. product) by catalog.
     *
     * @param string                      $indexIdentifier An index identifier
     * @param LocalizedCatalog|int|string $catalog         Catalog
     *
     * @return string[]
     */
    public function getNewIndexMetadataAliases(string $indexIdentifier, LocalizedCatalog|int|string $catalog): array
    {
        $catalog = $this->getCatalog($catalog);

        return [
            sprintf('.entity_%s', $indexIdentifier),
            sprintf('.catalog_%d', $catalog->getId()),
        ];
    }

    /**
     * Returns settings used during index creation.
     *
     * @return array<mixed>
     */
    public function getCreateIndexSettings(): array
    {
        return [
            'requests.cache.enable' => true,
            'number_of_replicas' => 0,
            'number_of_shards' => $this->getNumberOfShards(),
            'refresh_interval' => self::FULL_REINDEX_REFRESH_INTERVAL,
            'merge.scheduler.max_thread_count' => 1,
            'translog.durability' => self::FULL_REINDEX_TRANSLOG_DURABILITY,
            'codec' => self::CODEC,
            'max_result_window' => $this->getMaxResultWindow(),
            'mapping.total_fields.limit' => self::TOTAL_FIELD_LIMIT,
        ];
    }

    /**
     * Returns settings used when installing an index.
     *
     * @return array<mixed>
     */
    public function getInstallIndexSettings(): array
    {
        return [
            'number_of_replicas' => $this->getNumberOfReplicas(),
            'refresh_interval' => self::DIFF_REINDEX_REFRESH_INTERVAL,
            'translog' => ['durability' => self::DIFF_REINDEX_TRANSLOG_DURABILITY],
        ];
    }

    /**
     * Get number of shards from the configuration.
     */
    public function getNumberOfShards(): int
    {
        return (int) $this->getIndicesSettingsConfigParam('number_of_shards');
    }

    /**
     * Get number of replicas from the configuration.
     */
    public function getNumberOfReplicas(): int
    {
        return (int) $this->getIndicesSettingsConfigParam('number_of_replicas');
    }

    /**
     * Get number the batch indexing size from the configuration.
     */
    public function getBatchIndexingSize(): int
    {
        return (int) $this->getIndicesSettingsConfigParam('batch_indexing_size');
    }

    /**
     * Max number of results per query.
     */
    public function getMaxResultWindow(): int
    {
        return (int) $this->getNumberOfShards() * self::PER_SHARD_MAX_RESULT_WINDOW;
    }

    /**
     * Get maximum shingle diff for an index.
     *
     * @param array<mixed> $analysisSettings Index analysis settings
     */
    public function getMaxShingleDiff(array $analysisSettings): int|false
    {
        $maxShingleDiff = false;
        foreach ($analysisSettings['filter'] ?? [] as $filter) {
            if (($filter['type'] ?? null) === 'shingle') {
                // @codingStandardsIgnoreStart
                $filterDiff = (int) ($filter['max_shingle_size'] ?? self::MAX_SHINGLE_SIZE_DEFAULT)
                    - (int) ($filter['min_shingle_size'] ?? self::MIN_SHINGLE_SIZE_DEFAULT);
                // codingStandardsIgnoreEnd
                $maxShingleDiff = max((int) $maxShingleDiff, $filterDiff) + 1;
            }
        }

        return $maxShingleDiff;
    }

    /**
     * Get maximum ngram diff for an index.
     *
     * @param array<mixed> $analysisSettings Index analysis Settings
     */
    public function getMaxNgramDiff(array $analysisSettings): int|false
    {
        $maxNgramDiff = false;
        foreach ($analysisSettings['filter'] ?? [] as $filter) {
            if (\in_array(($filter['type'] ?? null), ['ngram', 'edge_ngram'], true)) {
                $filterDiff = (int) ($filter['max_gram'] ?? self::MAX_NGRAM_SIZE_DEFAULT)
                    - (int) ($filter['min_gram'] ?? self::MIN_NGRAM_SIZE_DEFAULT);

                $maxNgramDiff = max((int) $maxNgramDiff, $filterDiff) + 1;
            }
        }

        return $maxNgramDiff;
    }

    /**
     * Extract original entity from index metadata aliases.
     */
    public function extractEntityFromAliases(Index $index): string|null
    {
        $entityType = preg_filter('#^\.entity_(.+)$#', '$1', $index->getAliases(), 1);
        if (!empty($entityType)) {
            if (\is_array($entityType)) {
                $entityType = current($entityType);
            }
        } else {
            $entityType = null;
        }

        return $entityType;
    }

    /**
     * Extract original catalog id from index metadata aliases.
     *
     * @throws Exception
     */
    public function extractCatalogFromAliases(Index $index): LocalizedCatalog|null
    {
        $catalogId = preg_filter('#^\.catalog_(.+)$#', '$1', $index->getAliases(), 1);
        if (!empty($catalogId)) {
            if (\is_array($catalogId)) {
                $catalogId = current($catalogId);
            }
            $catalogId = (int) $catalogId;
            $catalog = $this->getCatalog($catalogId);
        } else {
            $catalog = null;
        }

        return $catalog;
    }

    /**
     * Check if index name follow the naming convention.
     */
    public function isInternal(Index $index): bool
    {
        return 1 === preg_match("#^{$this->getIndexNamePrefix()}_.*_.*_[0-9]{8}_[0-9]{6}$#", $index->getName());
    }

    /**
     * Check if index has been installed.
     */
    public function isInstalled(Index $index): bool
    {
        $installedAlias = $this->getIndexAliasFromIdentifier($index->getEntityType(), $index->getCatalog());

        return \in_array($installedAlias, $index->getAliases(), true);
    }

    /**
     * Check if index is obsolete.
     */
    public function isObsolete(Index $index): bool
    {
        if (!$this->isInternal($index)) {
            return false;
        }

        $timestampPattern = $this->getIndicesSettingsConfigParam('timestamp_pattern');
        $timeBeforeGhost = $this->getIndicesSettingsConfigParam('time_before_ghost');
        preg_match("#^{$this->getIndexNamePrefix()}_.*_.*_([0-9]{8}_[0-9]{6})$#", $index->getName(), $creationTime);
        $creationTime = \DateTime::createFromFormat(str_replace(['{', '}'], '', $timestampPattern), $creationTime[1]);
        $currentTime = new \DateTime();

        return ($currentTime->getTimestamp() - $creationTime->getTimestamp()) > $timeBeforeGhost;
    }

    /**
     * Get the index prefix from the configuration.
     */
    protected function getIndexNamePrefix(): string
    {
        return $this->getIndicesSettingsConfigParam('prefix');
    }

    /**
     * Get index name suffix.
     *
     * @param \DateTime $date Date
     */
    private function getIndexNameSuffix(\DateTime $date): string
    {
        /*
         * Generate the suffix of the index name from the current date.
         * e.g : Default pattern "{{YYYYMMdd}}_{{HHmmss}}" is converted to "20160221_123421".
         */
        $indexNameSuffix = $this->indicesConfiguration['timestamp_pattern'];

        // Parse pattern to extract datetime tokens.
        $matches = [];
        preg_match_all('/{{([\w]*)}}/', $indexNameSuffix, $matches);

        foreach (array_combine($matches[0], $matches[1]) as $k => $v) {
            // Replace tokens (UTC date used).
            $indexNameSuffix = str_replace($k, $date->format($v), $indexNameSuffix);
        }

        return $indexNameSuffix;
    }

    /**
     * Read config under the path elasticsuite.yaml/indices_settings.
     *
     * @param string $configField Configuration field name
     */
    private function getIndicesSettingsConfigParam(string $configField): mixed
    {
        return $this->indicesConfiguration[$configField] ?? null;
    }

    /**
     * Retrieve the catalog code from object or catalog id.
     *
     * @param int|string|LocalizedCatalog $catalog The catalog or its id or its code
     *
     * @throws Exception
     */
    private function getCatalogCode(int|string|LocalizedCatalog $catalog): ?string
    {
        return $this->getCatalog($catalog)->getCode();
    }

    /**
     * Ensure catalog is an object or load it from its id / identifier.
     *
     * @param int|string|LocalizedCatalog $catalog The catalog or its id or its code
     *
     * @throws Exception
     */
    private function getCatalog(LocalizedCatalog|int|string $catalog): LocalizedCatalog
    {
        if (!\is_object($catalog)) {
            if (is_numeric($catalog)) {
                $catalog = $this->catalogRepository->find($catalog);
            } else {
                $catalog = $this->catalogRepository->findOneBy(['code' => $catalog]);
            }
        }

        if (null === $catalog) {
            throw new Exception('Missing catalog.');
        }

        return $catalog;
    }
}
