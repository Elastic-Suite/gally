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

namespace Gally\Index\Repository\Index;

use Gally\Index\Dto\Bulk;
use Gally\Index\Model\Index;

interface IndexRepositoryInterface
{
    /**
     * List all indices.
     *
     * @return Index[]
     */
    public function findAll(): array;

    /**
     * Find a specific index identified by its name.
     *
     * @param string $indexName index name
     */
    public function findByName(string $indexName): ?Index;

    /**
     * Create an index in Elasticsearch with an optional alias.
     *
     * @param string       $indexName index name
     * @param array<mixed> $settings  index settings
     * @param string[]     $aliases   index aliases to assign after index creation
     */
    public function create(string $indexName, array $settings = [], array $aliases = []): Index;

    /**
     * Send bulk to index.
     *
     * @param Index        $index   indices name
     * @param Bulk\Request $request bulk request
     */
    public function bulk(Index $index, Bulk\Request $request): Bulk\Response;

    /**
     * Refresh an index or a list of indices.
     *
     * @param string[]|string $indexName One or several indices names
     */
    public function refresh(array|string $indexName): void;

    /**
     * Delete a given index.
     *
     * @param string $indexName index name
     */
    public function delete(string $indexName): void;

    /**
     * Get the alias/aliases of a given index.
     *
     * @param string $indexName index name
     * @param string $alias     index alias name(s), accepts wildcards
     *
     * @return array<mixed>
     */
    public function getIndexAliases(string $indexName, string $alias = '*'): array;

    /**
     * Returns whether a given alias exists or a given alias is assigned to a given index.
     * Returns all alias (globally or for a given index) if a wildcard is used for alias name.
     *
     * @param string      $alias     Index alias
     * @param string|null $indexName Index name
     */
    public function aliasExists(string $alias, string $indexName = null): bool;

    /**
     * Update alias definitions.
     *
     * @param array<mixed> $aliasActions Alias actions
     */
    public function updateAliases(array $aliasActions): void;

    /**
     * Update index mapping.
     *
     * @param string[]|string $indexName One or several indices names
     * @param array           $mapping   Mapping definition
     */
    public function putMapping(array|string $indexName, array $mapping): void;

    /**
     * Retrieves the mapping of one or several indices.
     *
     * @param string[]|string $indexName One or several indices names
     *
     * @return array<mixed>
     */
    public function getMapping(array|string $indexName): array;

    /**
     * Apply settings to the index.
     *
     * @param string       $indexName     index name
     * @param array<mixed> $indexSettings index settings
     */
    public function putSettings(string $indexName, array $indexSettings): void;

    /**
     * Performs the force merge operation on one or several indices.
     *
     * @param string[]|string $indexName One or several indices names
     */
    public function forceMerge(array|string $indexName): void;

    /**
     * Performs a local reindex between two indices.
     *
     * @param string $sourceIndexName Source index name
     * @param string $destIndexName   Destination index name
     * @param bool   $asynchronous    Should the reindex be made asynchronous
     */
    public function reindex(string $sourceIndexName, string $destIndexName, bool $asynchronous): array;
}
