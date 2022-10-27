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

namespace Elasticsuite\Product\Tests\Service;

class SearchSettingsProvider extends \Elasticsuite\Product\Service\SearchSettingsProvider
{
    /**
     * This method allow unit test to override search settings dynamically.
     */
    public function set(string $key, mixed $value): void
    {
        $class = new \ReflectionClass(\Elasticsuite\Product\Service\SearchSettingsProvider::class);
        $searchSettingsProp = $class->getProperty('searchSettings');
        $searchSettingsProp->setAccessible(true);
        $settings = $searchSettingsProp->getValue($this);
        $settings[$key] = $value;
        $searchSettingsProp->setValue($this, $settings);
    }
}
