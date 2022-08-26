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

namespace Elasticsuite\Fixture\Service;

interface EntityIndicesFixturesInterface
{
    /**
     * Creates and installs Elasticsearch indices through the API for a given entity type and one specific catalog or all of them.
     *
     * @param string          $entityType                 Entity type
     * @param string|int|null $localizedCatalogIdentifier Catalog identifier (code or id) to limit the index creation to
     */
    public function createEntityElasticsearchIndices(string $entityType, string|int|null $localizedCatalogIdentifier = null): void;

    /**
     * Removes installed Elasticsearch indices through the API for a given entity type and one specific catalog or all of them.
     *
     * @param int|string|null $localizedCatalogIdentifier Catalog identifier (code or id) to limit to the index deletion to
     */
    public function deleteEntityElasticsearchIndices(string $entityType, int|string|null $localizedCatalogIdentifier = null): void;
}
