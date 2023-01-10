<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Tests\Service;

class SearchSettingsProvider extends \Elasticsuite\Search\Service\SearchSettingsProvider
{
    /**
     * This method allow unit test to override search settings dynamically.
     */
    public function set(string $key, mixed $value): void
    {
        $class = new \ReflectionClass(\Elasticsuite\Search\Service\SearchSettingsProvider::class);
        $searchSettingsProp = $class->getProperty('searchSettings');
        $searchSettingsProp->setAccessible(true);
        $settings = $searchSettingsProp->getValue($this);
        $settings[$key] = $value;
        $searchSettingsProp->setValue($this, $settings);
    }
}
