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
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryProductMerchandisingRepository;
use Elasticsuite\Category\Service\CategorySynchronizer;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\MutationResolver\BulkIndexMutation;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class SyncCategoryDataAfterBulkDelete implements MutationResolverInterface
{
    public function __construct(
        private BulkIndexMutation $decorated,
        private CategorySynchronizer $synchronizer,
        private IndexSettingsInterface $indexSettings,
        private IndexRepositoryInterface $indexRepository,
        private CategoryProductMerchandisingRepository $categoryProductMerchandisingRepository,
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

        if (null !== $index->getEntityType() && $this->indexSettings->isInstalled($index)) { // Don't synchronize if index is not installed
            if ('category' === $index->getEntityType()) { // Synchronize sql data for category entity
                $this->indexRepository->refresh($index->getName()); // Force refresh to avoid missing data
                try {
                    $this->synchronizer->synchronize($index);
                } catch (SyncCategoryException) {
                    // If sync failed, retry sync once, then log the error.
                    $this->synchronizer->synchronize($index);
                }
            }

            if ('product' === $index->getEntityType()) {
                // Todo: For the moment we remove only values in the scope localized catalog, the others scopes will be managed in ticket ESPP-437.
                $this->categoryProductMerchandisingRepository->removeByProductIdAndLocalizedCatalog(
                    $context['args']['input']['ids'],
                    $index->getCatalog()
                );
            }
        }

        return $index;
    }
}
