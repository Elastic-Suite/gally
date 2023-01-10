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

namespace Gally\Search\Elasticsearch\Request\Aggregation\ConfigResolver;

use Gally\Category\Repository\CategoryRepository;
use Gally\Category\Service\CurrentCategoryProvider;
use Gally\Metadata\Model\SourceField;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Model\Facet\Configuration;

class CategoryAggregationConfigResolver implements FieldAggregationConfigResolverInterface
{
    public function __construct(
        private CurrentCategoryProvider $currentCategoryProvider,
        private CategoryRepository $categoryRepository,
        private QueryFactory $queryFactory,
    ) {
    }

    public function supports(Configuration $facetConfig): bool
    {
        return SourceField\Type::TYPE_CATEGORY === $facetConfig->getSourceField()->getType();
    }

    /**
     * The category aggregation should return only the categories that are direct child of the current category.
     * If no category are provided in context, the aggregation should return only first level categories.
     */
    public function getConfig(ContainerConfigurationInterface $containerConfig, Configuration $facetConfig): array
    {
        $config = [];

        $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
        $children = $this->categoryRepository->findBy(['parentId' => $currentCategory]);
        $queries = [];

        foreach ($children as $child) {
            $queries[$child->getId()] = $this->queryFactory->create(
                QueryInterface::TYPE_TERM,
                ['field' => $facetConfig->getSourceField()->getCode() . '.id', 'value' => $child->getId()]
            );
        }

        if (!empty($queries)) {
            $config = [
                'name' => $facetConfig->getSourceField()->getCode() . '.id',
                'type' => BucketInterface::TYPE_QUERY_GROUP,
                'queries' => $queries,
            ];
        }

        return $config;
    }
}
