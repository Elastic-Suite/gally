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

namespace Elasticsuite\VirtualCategory\Decoration\Product\GraphQl\Type\Definition\Filter;

use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Product\GraphQl\Type\Definition\Filter\TextTypeFilterInputType as BaseTextTypeFilterInputType;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Allows to convert a category filter in Es query filters.
 */
class TextTypeFilterInputType extends BaseTextTypeFilterInputType
{
    public $name = BaseTextTypeFilterInputType::NAME;

    public function __construct(
        private RuleEngineManager $ruleEngineManager,
        private CategoryRepository $categoryRepository,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        protected FilterQueryBuilder $filterQueryBuilder,
        private QueryFactory $queryFactory,
        private BaseTextTypeFilterInputType $decorated,
        private string $nestingSeparator,
    ) {
        parent::__construct($this->filterQueryBuilder, $this->queryFactory, $this->nestingSeparator);
    }

    /**
     * Temporary solution awaiting the category type attribute.
     * Allows to transform category_id filter ES filters for virtual categories.
     */
    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface
    {
        if (isset($inputFilter['field']) && 'category__id' == $inputFilter['field'] && isset($inputFilter['eq'])) {
            $category = $this->categoryRepository->find(trim($inputFilter['eq']));

            if ($category instanceof Category) {
                $categoryConfiguration = $this->categoryConfigurationRepository->findOneMergedByContext(
                    $category,
                    $containerConfig->getCatalog()->getCatalog(),
                    $containerConfig->getCatalog()
                );

                if ($categoryConfiguration instanceof Category\Configuration
                    && $categoryConfiguration->getIsVirtual()
                ) {
                    if (null !== $categoryConfiguration->getVirtualRule()) {
                        $esFilters = $this->ruleEngineManager->transformRuleToElasticsuiteFilters(
                            json_decode($categoryConfiguration->getVirtualRule(), true),
                            $containerConfig
                        );

                        if (!empty($esFilters)) {
                            return current($esFilters);
                        }
                    }

                    return $this->filterQueryBuilder->create($containerConfig, []);
                }
            }
        }

        return $this->decorated->transformToElasticsuiteFilter($inputFilter, $containerConfig);
    }
}
