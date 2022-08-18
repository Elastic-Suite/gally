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

namespace Elasticsuite\Category\EventSubscriber;

use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Elasticsuite\Category\Model\Category\ProductMerchandising;
use Elasticsuite\Category\Service\CategoryProductPositionManager;

class ReindexPosition implements EventSubscriberInterface
{
    public function __construct(
        private CategoryProductPositionManager $categoryProductPositionManager,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postRemove,
            Events::postUpdate,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->reindexPosition($args);
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->reindexPosition($args);
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $this->reindexPosition($args, true);
    }

    private function reindexPosition(LifecycleEventArgs $args, bool $deleteMode = false): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof ProductMerchandising) {
            return;
        }

        $productMerchandising = $entity;
        if ($deleteMode) {
            $productMerchandising->setPosition(null);
        }

        $this->categoryProductPositionManager->reindexPosition($productMerchandising);
    }
}
