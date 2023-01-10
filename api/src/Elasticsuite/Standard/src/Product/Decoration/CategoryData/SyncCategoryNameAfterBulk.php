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

namespace Elasticsuite\Product\Decoration\CategoryData;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Product\Service\CategoryNameUpdater;

class SyncCategoryNameAfterBulk implements MutationResolverInterface
{
    public function __construct(
        private MutationResolverInterface $decorated,
        private CategoryNameUpdater $categoryNameUpdater
    ) {
    }

    /**
     * @param object|null $item
     *
     * @return object|null
     */
    public function __invoke($item, array $context)
    {
        /** @var Index $index */
        $index = $this->decorated->__invoke($item, $context);

        if (null !== $index->getEntityType()) {
            if ('category' === $index->getEntityType()) {
                // Handle category name change ?
            }

            if (('product' === $index->getEntityType()) && $index->getLocalizedCatalog()) {
                // Handle copying category.name to category._name
                $this->categoryNameUpdater->updateCategoryNames(
                    $index,
                    json_decode($context['args']['input']['data'], true)
                );
            }
        }

        return $index;
    }
}
