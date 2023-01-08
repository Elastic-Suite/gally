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
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class SyncCategoryDataAfterBulk implements MutationResolverInterface
{
    public function __construct(
        private MutationResolverInterface $decorated,
        private CategorySynchronizer $synchronizer,
        private IndexSettingsInterface $indexSettings,
        private IndexRepositoryInterface $indexRepository,
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

        if (null !== $index->getEntityType() && $this->indexSettings->isInstalled($index)) { // Don't synchronize if index is not installed
            if ('category' === $index->getEntityType()) { // Synchronize sql data for category entity
                $this->indexRepository->refresh($index->getName()); // Force refresh to avoid missing data
                try {
                    $this->synchronizer->synchronize($index, json_decode($context['args']['input']['data'], true));
                } catch (SyncCategoryException) {
                    // If sync failed, retry sync once, then log the error.
                    $this->synchronizer->synchronize($index, json_decode($context['args']['input']['data'], true));
                }
            }

            if ('product' === $index->getEntityType()) {
                $this->indexRepository->refresh($index->getName()); // Force refresh to avoid missing data
                $this->categoryProductPositionManager->reindexPositionsByIndex(
                    $index,
                    array_column(json_decode($context['args']['input']['data'], true), 'id')
                );
            }
        }

        return $index;
    }
}
