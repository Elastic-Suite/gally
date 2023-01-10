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

namespace Gally\Search\Tests\Service;

class SearchSettingsProvider extends \Gally\Search\Service\SearchSettingsProvider
{
    /**
     * This method allow unit test to override search settings dynamically.
     */
    public function set(string $key, mixed $value): void
    {
        $class = new \ReflectionClass(\Gally\Search\Service\SearchSettingsProvider::class);
        $searchSettingsProp = $class->getProperty('searchSettings');
        $searchSettingsProp->setAccessible(true);
        $settings = $searchSettingsProp->getValue($this);
        $settings[$key] = $value;
        $searchSettingsProp->setValue($this, $settings);
    }
}
