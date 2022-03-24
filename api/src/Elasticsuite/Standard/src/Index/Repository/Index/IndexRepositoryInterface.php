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

use Elasticsuite\Index\Model\Index;

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
     * @param string|null  $alias     index alias to assign after index creation
     */
    public function create(string $indexName, array $settings = [], string $alias = null): ?Index;

    /**
     * Refresh a list of indices.
     *
     * @param string[] $indexNames indices names
     */
    public function refresh(array $indexNames): void;

    /**
     * Delete a given index.
     *
     * @param string $indexName index name
     */
    public function delete(string $indexName): void;
}
