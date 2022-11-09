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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Modifier;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Modifier Interface for attributes aggregations provider.
 */
interface ModifierInterface
{
    /**
     * @param Metadata                   $metadata         metadata
     * @param LocalizedCatalog           $localizedCatalog the localized catalog
     * @param SourceField[]              $sourceFields
     * @param string|QueryInterface|null $query            search request query
     * @param array                      $filters          search request filters
     * @param QueryInterface[]           $queryFilters     search request filters prebuilt as QueryInterface
     *
     * @return SourceField[]
     */
    public function modifySourceFields(
        Metadata $metadata,
        LocalizedCatalog $localizedCatalog,
        array $sourceFields,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array;

    /**
     * @param Metadata                   $metadata         metadata
     * @param LocalizedCatalog           $localizedCatalog the localized catalog
     * @param array                      $aggregations     the aggregations
     * @param string|QueryInterface|null $query            search request query
     * @param array                      $filters          search request filters
     * @param QueryInterface[]           $queryFilters     search request filters prebuilt as QueryInterface
     */
    public function modifyAggregations(
        Metadata $metadata,
        LocalizedCatalog $localizedCatalog,
        array $aggregations,
        QueryInterface|string|null $query,
        array $filters,
        array $queryFilters
    ): array;
}
