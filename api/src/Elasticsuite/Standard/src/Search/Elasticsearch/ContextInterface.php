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

namespace Elasticsuite\Search\Elasticsearch;

// use Elasticsuite\Catalog\Api\Data\CategoryInterface;
// use Elasticsuite\Search\Model\QueryTextInterface;

/**
 * Search Context Interface.
 */
interface ContextInterface
{
    /*
     * Set current category to Search Context.
     *
     * @param CategoryInterface $category Current Category
     */
    // public function setCurrentCategory(CategoryInterface $category): ContextInterface;

    /*
     * Set current search query to Search Context
     *
     * @param QueryTextInterface $query Current Search Query
     *
     * @return $this
     */
    // public function setCurrentSearchQuery(QueryTextInterface $query): ContextInterface;

    /*
     * Set Localized Catalog Id.
     *
     * @param int $catalogId Catalog Id
     *
     * @return $this
     */
    // public function setCatalogId(int $catalogId);

    /*
     * Set Customer Group Id
     *
     * @param int $customerGroupId Customer Group Id
     *
     * @return $this
     */
    // public function setCustomerGroupId(int $customerGroupId);

    // public function getCurrentCategory(): CategoryInterface;

    // public function getCurrentSearchQuery(): QueryTextInterface;

    // public function getCatalogId(): int;

    // public function getCustomerGroupId(): int|null;
}
