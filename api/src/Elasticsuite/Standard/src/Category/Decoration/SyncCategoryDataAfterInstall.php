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

namespace Elasticsuite\Category\Decoration;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Category\Exception\SyncCategoryException;
use Elasticsuite\Category\Service\CategoryProductPositionManager;
use Elasticsuite\Category\Service\CategorySynchronizer;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\MutationResolver\InstallIndexMutation;

class SyncCategoryDataAfterInstall implements MutationResolverInterface
{
    public function __construct(
        private InstallIndexMutation $decorated,
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
