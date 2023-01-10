<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Gally\VirtualCategory\Elasticsearch\Request\Aggregation\ConfigResolver;

use Gally\Category\Repository\CategoryRepository;
use Gally\Category\Service\CurrentCategoryProvider;
use Gally\Search\Elasticsearch\Request\Aggregation\ConfigResolver\CategoryAggregationConfigResolver as BaseCategoryAggregationConfigResolver;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Model\Facet\Configuration;
use Gally\VirtualCategory\Service\CategoryQueryProvider;

class CategoryAggregationConfigResolver extends BaseCategoryAggregationConfigResolver
{
    public function __construct(
        private CurrentCategoryProvider $currentCategoryProvider,
        private CategoryRepository $categoryRepository,
        private CategoryQueryProvider $categoryQueryProvider,
    ) {
    }

    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array
    {
        $config = [];

        $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
        $children = $this->categoryRepository->findBy(['parentId' => $currentCategory]);
        $queries = [];
        $filterContext = []; // Declare the filter context here in order to share it between children queries calculation.
        foreach ($children as $child) {
            $queries[$child->getId()] = $this->categoryQueryProvider->getQuery(
                $facetConfig->getSourceField()->getCode() . '.id',
                $child,
                $containerConfig,
                $filterContext
            );
        }

        if (!empty($queries)) {
            $config = [
                'name' => $facetConfig->getSourceField()->getCode() . '.id',
                'type' => BucketInterface::TYPE_QUERY_GROUP,
                'queries' => $queries,
                'unsetNestedPath' => true,
            ];
        }

        return $config;
    }
}
