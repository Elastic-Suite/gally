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

namespace Gally\Category\Decoration;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Gally\Category\Exception\SyncCategoryException;
use Gally\Category\Service\CategoryProductPositionManager;
use Gally\Category\Service\CategorySynchronizer;
use Gally\Index\Model\Index;

class SyncCategoryDataAfterInstall implements MutationResolverInterface
{
    public function __construct(
        private MutationResolverInterface $decorated,
        private CategorySynchronizer $synchronizer,
        private CategoryProductPositionManager $categoryProductPositionManager,
    ) {
    }

    /**
     * @param Index|null $item
     *
     * @return Index
     */
    public function __invoke($item, array $context)
    {
        /** @var Index $index */
        $index = $this->decorated->__invoke($item, $context);

        if ('category' === $index->getEntityType()) { // Synchronize sql data for category entity
            try {
                $this->synchronizer->synchronize($index);
            } catch (SyncCategoryException) {
                // If sync failed, retry sync once, then log the error.
                $this->synchronizer->synchronize($index);
            }
        }

        if ('product' === $index->getEntityType()) {
            $this->categoryProductPositionManager->reindexPositionsByIndex($index);
        }

        return $index;
    }
}
