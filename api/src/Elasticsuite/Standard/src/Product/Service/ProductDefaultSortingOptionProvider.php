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

namespace Elasticsuite\Product\Service;

use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Service\CurrentCategoryProvider;
use Elasticsuite\Search\Elasticsearch\Request\Container\DefaultSortingOptionProviderInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Search\Service\SearchSettingsProvider;

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
