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

namespace Gally\Category\EventSubscriber;

use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Gally\Category\Model\Category\ProductMerchandising;
use Gally\Category\Service\CategoryProductPositionManager;

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
