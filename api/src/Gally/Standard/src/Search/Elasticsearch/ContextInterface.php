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

namespace Gally\Search\Elasticsearch;

// use Gally\Catalog\Api\Data\CategoryInterface;
// use Gally\Search\Model\QueryTextInterface;

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
