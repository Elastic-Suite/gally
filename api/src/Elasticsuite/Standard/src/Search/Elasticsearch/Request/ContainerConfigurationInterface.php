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

namespace Elasticsuite\Search\Elasticsearch\Request;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Model\Index\MappingInterface;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;

/**
 * Search request container configuration interface.
 */
interface ContainerConfigurationInterface
{
    /**
     * Search request container name.
     */
    public function getName(): string;

    /**
     * Search request container index name.
     */
    public function getIndexName(): string;

    /**
     * Search request container label.
     */
    public function getLabel(): string;

    /**
     * Search request container mapping.
     */
    public function getMapping(): MappingInterface;

    /**
     * Retrieve the fulltext search relevance configuration for the container.
     */
    public function getRelevanceConfig(): RelevanceConfigurationInterface;

    /**
     * Current container store.
     */
    public function getCatalog(): LocalizedCatalog;

    /**
     * Current metadata.
     */
    public function getMetadata(): Metadata;

    /**
     * Retrieve filters for the container (visibility, in stock, etc ...) and the current search Context.
     *
     * @return QueryInterface[]
     */
    public function getFilters(): array;

    /**
     * Get aggregations configured in the search container.
     *
     * @param string|QueryInterface|null $query        Search request query
     * @param QueryInterface[]           $filters      Search request filters
     * @param QueryInterface[]           $queryFilters Search request filters prebuilt as QueryInterface
     */
    public function getAggregations(string|QueryInterface|null $query = null, array $filters = [], array $queryFilters = []): array;

    /**
     * Get the value of the track_total_hits parameter, if any.
     */
    public function getTrackTotalHits(): int|bool;
}
