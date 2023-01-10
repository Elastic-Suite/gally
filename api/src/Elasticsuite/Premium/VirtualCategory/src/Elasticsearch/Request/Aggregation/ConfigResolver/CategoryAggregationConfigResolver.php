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
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\VirtualCategory\Elasticsearch\Request\Aggregation\ConfigResolver;

use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Category\Service\CurrentCategoryProvider;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\ConfigResolver\CategoryAggregationConfigResolver as BaseCategoryAggregationConfigResolver;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Facet\Configuration;
use Elasticsuite\VirtualCategory\Service\CategoryQueryProvider;

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
