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
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Service\CategorySynchronizer;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\MutationResolver\BulkIndexMutation;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class SyncCategoryDataAfterBulkDelete implements MutationResolverInterface
{
    public function __construct(
        private BulkIndexMutation $decorated,
        private IndexSettingsInterface $indexSettings,
        private IndexRepositoryInterface $indexRepository,
        private CategorySynchronizer $synchronizer,
    ) {
    }

    /**
     * @param Index|null $item
     *
     * @return Index
     */
    public function __invoke($item, array $context)
    {
        $index = $this->decorated->__invoke($item, $context);

        if (
            'category' === $index->getEntityType()          // Synchronize sql data for category entity
            && $this->indexSettings->isInstalled($index)    // Don't synchronize if index is not installed
        ) {
            $this->indexRepository->refresh($index->getName()); // Force refresh to avoid missing data
            $this->synchronizer->synchronize($index);
        }

        return $index;
    }
}
