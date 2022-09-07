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

namespace Elasticsuite\Catalog\Tests\Unit;

use Elasticsuite\Catalog\Exception\NoCatalogException;
use Elasticsuite\Catalog\Service\DefaultCatalogProvider;
use Elasticsuite\Test\AbstractTest;

class DefaultCatalogProviderTest extends AbstractTest
{
    protected DefaultCatalogProvider $defaultCatalogProvider;

    protected function setUp(): void
    {
        parent::setUp();
        $this->defaultCatalogProvider = static::getContainer()->get('Elasticsuite\Catalog\Service\DefaultCatalogProviderTest'); // @phpstan-ignore-line
        $this->loadFixture([__DIR__ . '/../fixtures/catalogs.yaml']);
    }

    public function testNoLocalizedCatalog(): void
    {
        $this->expectException(NoCatalogException::class);
        $this->defaultCatalogProvider->getDefaultLocalizedCatalog();
    }

    public function testGetLocalizedCatalog(): void
    {
        $this->loadFixture([__DIR__ . '/../fixtures/catalogs.yaml', __DIR__ . '/../fixtures/localized_catalogs.yaml']);
        $catalog = $this->defaultCatalogProvider->getDefaultLocalizedCatalog();
        $this->assertEquals('B2C French Store View', $catalog->getName());

        $this->loadFixture([__DIR__ . '/../fixtures/catalogs.yaml', __DIR__ . '/../fixtures/localized_catalogs_with_default.yaml']);
        $catalog = $this->defaultCatalogProvider->getDefaultLocalizedCatalog();
        $this->assertEquals('B2B English Store View', $catalog->getName());
    }
}
