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

namespace Elasticsuite\Locale\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Set the app locale according to the value of the Elasticsuite-Language header.
 */
class LocaleSubscriber implements EventSubscriberInterface
{
    public const ELASTICSUITE_LANGUAGE_HEADER = 'Elasticsuite-Language';
    public const ELASTICSUITE_LANGUAGE_VARY_KEY = '_vary_by_elasticsuite_language';

    public function __construct(
        private array $enabledLocales,
    ) {
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $languageHeader = $request->headers->get(self::ELASTICSUITE_LANGUAGE_HEADER);
        if ($languageHeader) {
            /**
             * We replace the value of Accept-Language by the value of the elasticsuite language header
             * because all the logic to extract languages from a "language header" is implemented in $request->getPreferredLanguage()
             * and this function is based on Accept-Language header.
             */
            $origAcceptLanguage = $request->headers->get('Accept-Language');
            $request->headers->set('Accept-Language', $languageHeader);
            $locale = $request->getPreferredLanguage($this->enabledLocales);
            $request->headers->set('Accept-Language', $origAcceptLanguage);
            $request->setLocale($locale);
            $request->attributes->set(self::ELASTICSUITE_LANGUAGE_VARY_KEY, true);
        }
    }

    /**
     * @return array<string,array>
     */
    public static function getSubscribedEvents(): array
    {
        return [
            // Must be registered before LocaleListener.
            KernelEvents::REQUEST => [['onKernelRequest', 20]],
        ];
    }
}
