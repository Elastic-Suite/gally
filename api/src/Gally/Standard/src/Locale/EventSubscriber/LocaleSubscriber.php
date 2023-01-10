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

namespace Gally\Locale\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Set the app locale according to the value of the Gally-Language header.
 */
class LocaleSubscriber implements EventSubscriberInterface
{
    public const GALLY_LANGUAGE_HEADER = 'Gally-Language';
    public const GALLY_LANGUAGE_VARY_KEY = '_vary_by_gally_language';

    public function __construct(
        private array $enabledLocales,
    ) {
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $languageHeader = $request->headers->get(self::GALLY_LANGUAGE_HEADER);
        if ($languageHeader) {
            /**
             * We replace the value of Accept-Language by the value of the gally language header
             * because all the logic to extract languages from a "language header" is implemented in $request->getPreferredLanguage()
             * and this function is based on Accept-Language header.
             */
            $origAcceptLanguage = $request->headers->get('Accept-Language');
            $request->headers->set('Accept-Language', $languageHeader);
            $locale = $request->getPreferredLanguage($this->enabledLocales);
            $request->headers->set('Accept-Language', $origAcceptLanguage);
            $request->setLocale($locale);
            $request->attributes->set(self::GALLY_LANGUAGE_VARY_KEY, true);
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
