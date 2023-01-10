<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Category\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Elasticsuite\Category\Model\Source\CategorySortingOption;
use Elasticsuite\Category\Service\CategoryProductsSortingOptionsProvider;

class CategorySortingOptionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private CategoryProductsSortingOptionsProvider $sortingOptionsProvider
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return CategorySortingOption::class === $resourceClass;
    }

    /**
     * {@inheritDoc}
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): array
    {
        return $this->sortingOptionsProvider->getAllSortingOptions();
    }
}
