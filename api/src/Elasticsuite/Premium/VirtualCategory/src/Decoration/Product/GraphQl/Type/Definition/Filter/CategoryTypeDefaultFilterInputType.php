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
use Elasticsuite\Product\GraphQl\Type\Definition\Filter\CategoryTypeDefaultFilterInputType as BaseCategoryTypeDefaultFilterInputType;
use Elasticsuite\RuleEngine\Service\RuleEngineManager;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Psr\Log\LoggerInterface;

/**
 * Allows to convert a category filter in Es query filters.
 */
class CategoryTypeDefaultFilterInputType extends BaseCategoryTypeDefaultFilterInputType
{
    public $name = BaseCategoryTypeDefaultFilterInputType::SPECIFIC_NAME;
    public const CATEGORY_PROCESSED_KEY = 'category_processed';
    public const VIRTUAL_CATEGORY_PROCESSED_KEY = 'virtual_category_processed';

    protected array $categoryQueries = [];

    public function __construct(
        private RuleEngineManager $ruleEngineManager,
        private CategoryRepository $categoryRepository,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        protected FilterQueryBuilder $filterQueryBuilder,
        private QueryFactory $queryFactory,
        private LoggerInterface $logger,
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
                $categoryConfiguration = $this->categoryConfigurationRepository->findOneMergedByContext(
                    $category,
                    $containerConfig->getCatalog()->getCatalog(),
                    $containerConfig->getCatalog()
                );

                if ($categoryConfiguration instanceof Category\Configuration
                    && $categoryConfiguration->getIsVirtual()
                ) {
                    $this->categoryQueries[$categoryId] = $this->processVirtualCategories(
                        $categoryConfiguration->getCategory()->getId(),
                        $categoryConfiguration->getVirtualRule(),
                        $containerConfig,
                        $filterContext
                    );
                } else {
                    $this->categoryQueries[$categoryId] = $this->processPhysicalCategories($category, $inputFilter, $containerConfig, $filterContext);
                }

                return $this->categoryQueries[$categoryId];
            }
        }

        return parent::transformToElasticsuiteFilter($inputFilter, $containerConfig, $filterContext);
    }

    /**
     * The physical categories are anchor therefore, we have the parent physical categories in products documents, but for sub virtual categories we have to add virtual rules to get their products.
     * Cat_A (Physical)
     * ├─ Cat_B (Physical)
     * ├─ Cat_C (Physical)
     * │  ├─ Cat_C.1 (virtual)
     * │  │  ├─ Cat_C.1.1 (virtual)
     * │  │  ├─ Cat_C.1.2 (Physical)
     * │  │  │
     *
     * If we filter on Cat_A (category__id: Cat_A) :
     * products = Cat_A (implicitly Cat_B + Cat_C + Cat_C.1.2) + Cat_C.1  + Cat_C.1.1
     */
    protected function processPhysicalCategories(Category $category, array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext): QueryInterface
    {
        $this->addCategoryProcessed($category->getId(), $filterContext);
        //Will contains the rule of sub virtual categories whatever their level.
        $subVirtualCategoriesRules = [];
        $localizedCatalog = $containerConfig->getCatalog();
        $categoryConfigurations = $this->categoryConfigurationRepository->findMergedByContextAndCategoryPath($localizedCatalog->getCatalog(), $localizedCatalog, $category);

        foreach ($categoryConfigurations as $categoryConfiguration) {
            if ($categoryConfiguration['isVirtual'] && null !== $categoryConfiguration['virtualRule'] && $categoryConfiguration['isActive']) {
                $subVirtualCategoriesRules[] = $this->processVirtualCategories(
                    $categoryConfiguration['category_id'],
                    $categoryConfiguration['virtualRule'],
                    $containerConfig,
                    $filterContext
                );
            }
        }

        return $this->queryFactory->create(
            QueryInterface::TYPE_BOOL,
            [
                'should' => array_merge(
                    [parent::transformToElasticsuiteFilter($inputFilter, $containerConfig, $filterContext)],
                    $subVirtualCategoriesRules
                ),
            ]
        );
    }

    /**
     * Virtual categories are not anchor therefore,  we get only the products of the virtual category and not the products of its children.
     * Cat_A (Physical)
     * ├─ Cat_B (Physical)
     * ├─ Cat_C (Physical)
     * │  ├─ Cat_C.1 (Virtual) Rule: category = C.2 + color=rouge
     * │  ├─ Cat_C.2 (Virtual) Rule: category = C.1 + color=rouge
     * │  │  ├─ Cat_C.1.1 (Virtual)
     * │  │  ├─ Cat_C.1.2 (Physical)
     * │  │  │
     *
     * If we filter on Cat_C.1 (category__id: Cat_C.1) :
     * products = Cat_C.1 (we will not get products of Cat_C.1.1 and Cat_C.1.2)
     */
    protected function processVirtualCategories(string $categoryId, ?string $virtualRule, ContainerConfigurationInterface $containerConfig, array $filterContext): QueryInterface
    {
        $this->addCategoryProcessed($categoryId, $filterContext);
        $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY] = $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY] ?? [];

        if (\in_array($categoryId, $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY], true)) {
            $this->logger->error(
                "The virtual rule of the category '{$categoryId}' has been already processed for a category asked in filters, to avoid an infinite  loop the virtual rule has been skipped",
                [
                    'categoryId' => $categoryId,
                    self::CATEGORY_PROCESSED_KEY => $filterContext[self::CATEGORY_PROCESSED_KEY],
                    self::VIRTUAL_CATEGORY_PROCESSED_KEY => $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY],
                    'rule' => $virtualRule,
                ]
            );
        }

        if (null !== $virtualRule && !\in_array($categoryId, $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY], true)) {
            $filterContext[self::VIRTUAL_CATEGORY_PROCESSED_KEY][] = $categoryId;
            $esFilters = $this->ruleEngineManager->transformRuleToElasticsuiteFilters(
                json_decode($virtualRule, true),
                $containerConfig,
                $filterContext
            );

            if (!empty($esFilters)) {
                return current($esFilters);
            }
        }

        /*
         * If we detect a potential infinite loop we return a query to get an empty result (0 product).
         * An empty must bool query returns all the documents.
         * We "apply" a mustNot bool query on an empty must bool query to get 0 document.
         */
        return $this->queryFactory->create(
            QueryInterface::TYPE_BOOL,
            ['mustNot' => [
                $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['must' => []]),
            ]]
        );
    }

    protected function addCategoryProcessed(string $categoryId, array &$filterContext): void
    {
        $filterContext[self::CATEGORY_PROCESSED_KEY][] = $categoryId;
    }
}
