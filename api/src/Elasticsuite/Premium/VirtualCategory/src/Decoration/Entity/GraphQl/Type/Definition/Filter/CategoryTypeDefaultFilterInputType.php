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

namespace Elasticsuite\VirtualCategory\Decoration\Entity\GraphQl\Type\Definition\Filter;

use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\CategoryTypeDefaultFilterInputType as BaseCategoryTypeDefaultFilterInputType;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\VirtualCategory\Service\CategoryQueryProvider;

/**
 * Allows to convert a category filter in Es query filters.
 */
class CategoryTypeDefaultFilterInputType extends BaseCategoryTypeDefaultFilterInputType
{
    public $name = BaseCategoryTypeDefaultFilterInputType::SPECIFIC_NAME;

    protected array $categoryQueries = [];

    public function __construct(
        private CategoryRepository $categoryRepository,
        private CategoryQueryProvider $categoryQueryProvider,
        protected FilterQueryBuilder $filterQueryBuilder,
        protected QueryFactory $queryFactory,
        protected string $nestingSeparator,
    ) {
        parent::__construct($this->filterQueryBuilder, $this->queryFactory, $this->nestingSeparator);
    }

    /**
     * Allows to transform category_id filter to ES filters for virtual categories.
     */
    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        if (isset($inputFilter['eq'])) {
            $categoryId = trim($inputFilter['eq']);
            if (isset($this->categoryQueries[$categoryId])) {
                return $this->categoryQueries[$categoryId];
            }

            $category = $this->categoryRepository->find($categoryId);

            if ($category instanceof Category) {
                return $this->categoryQueryProvider->getQuery(
                    $this->getMappingFieldName($inputFilter['field']),
                    $category,
                    $containerConfig,
                    $filterContext,
                );
            }
        }

        return parent::transformToElasticsuiteFilter($inputFilter, $containerConfig, $filterContext);
    }
}
