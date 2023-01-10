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

namespace Gally\Cache\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use Gally\Cache\Service\ProxyCacheManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Allows to add extra cache tags in the HTTP response.
 */
class AddProxyCacheTagsSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private ProxyCacheManager $proxyCacheManager
    ) {
    }

    public function addCacheTags(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $class = $request->attributes->get('_api_resource_class');
        if (null !== $class) {
            $this->proxyCacheManager->addCacheTagResourceCollection($class, $request);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => ['addCacheTags', EventPriorities::POST_READ],
        ];
    }
}
