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

namespace Elasticsuite\Category\Repository\CategoryProductPositionIndexer;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Model\Category\ProductMerchandising;

interface CategoryProductPositionIndexerRepositoryInterface
{
    /**
     * @param array<int, LocalizedCatalog> $localizedCatalogs
     */
    public function reindex(ProductMerchandising $productMerchandising, array $localizedCatalogs): void;

    /**
     * $products format:
     * [
     *    '15 (product_id)' => [
     *        '1 (category_id)' => [
     *            'position'    => 10,
     *        ],
     *        '2 (category_id)' => [
     *            'position'    => 5,
     *        ]
     *    ],
     *    '17 (product_id)' => [
     *        '15 (category_id)' => [
     *            'position'    => 1,
     *        ],
     *        ...
     *    ],
     *    ...
     * ].
     *
     * @param array            $products         Products
     * @param LocalizedCatalog $localizedCatalog Localized catalog
     */
    public function reindexByProducts(array $products, LocalizedCatalog $localizedCatalog): void;
}
