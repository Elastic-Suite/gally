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

namespace Gally\Product\Service;

use Gally\Category\Repository\CategoryConfigurationRepository;
use Gally\Category\Service\CurrentCategoryProvider;
use Gally\Search\Elasticsearch\Request\Container\DefaultSortingOptionProviderInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;
use Gally\Search\Service\SearchSettingsProvider;

class ProductDefaultSortingOptionProvider implements DefaultSortingOptionProviderInterface
{
    public function __construct(
        private CurrentCategoryProvider $currentCategoryProvider,
        private CategoryConfigurationRepository $configurationRepository,
        private SearchSettingsProvider $searchSettingsProvider,
        private string $nestingSeparator,
    ) {
    }

    public function getSortingOption(ContainerConfigurationInterface $containerConfig): array
    {
        $category = $this->currentCategoryProvider->getCurrentCategory();

        if ($category) {
            $config = $this->configurationRepository->findOneMergedByContext(
                $category,
                $containerConfig->getLocalizedCatalog()->getCatalog(),
                $containerConfig->getLocalizedCatalog()
            );

            if ($config->getDefaultSorting()) {
                $direction = \in_array($config->getDefaultSorting(), $this->searchSettingsProvider->getDefaultAscSortField(), true)
                    ? SortOrderInterface::SORT_DESC
                    : SortOrderInterface::SORT_ASC;

                return [str_replace($this->nestingSeparator, '.', $config->getDefaultSorting()) => ['direction' => $direction]];
            }
        }

        return [];
    }
}
