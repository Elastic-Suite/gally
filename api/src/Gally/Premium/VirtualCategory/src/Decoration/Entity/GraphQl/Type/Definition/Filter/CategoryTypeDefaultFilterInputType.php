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

namespace Gally\VirtualCategory\Decoration\Entity\GraphQl\Type\Definition\Filter;

use Gally\Category\Model\Category;
use Gally\Category\Repository\CategoryRepository;
use Gally\Entity\GraphQl\Type\Definition\Filter\CategoryTypeDefaultFilterInputType as BaseCategoryTypeDefaultFilterInputType;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\VirtualCategory\Service\CategoryQueryProvider;

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
    public function transformToGallyFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
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

        return parent::transformToGallyFilter($inputFilter, $containerConfig, $filterContext);
    }
}
