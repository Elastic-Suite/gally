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
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright {2022} Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

namespace Elasticsuite\Index\Tests\Unit;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Service\IndexSettings;
use Elasticsuite\Standard\src\Test\AbstractTest;

class IndexResolverTest extends AbstractTest
{
    protected IndexSettings $indexSettings;

    protected function setUp(): void
    {
        parent::setUp();
        $this->indexSettings = static::getContainer()->get('Elasticsuite\Index\Service\IndexSettingsTest'); // @phpstan-ignore-line
        $this->loadFixture([
            __DIR__ . '/../fixtures/metadata.yaml',
            __DIR__ . '/../fixtures/catalogs.yaml',
        ]);
    }

    /**
     * @dataProvider indexAliasDataProvider
     *
     * @param string                      $indexIdentifier Index identifier
     * @param LocalizedCatalog|int|string $catalog         Catalog
     * @param string                      $expectedAlias   Expected index alias
     */
    public function testGetIndexAliasFromIdentifier(
        string $indexIdentifier,
        LocalizedCatalog|int|string $catalog,
        string $expectedAlias
    ): void {
        $indexAlias = $this->indexSettings->getIndexAliasFromIdentifier($indexIdentifier, $catalog);
        $this->assertEquals($expectedAlias, $indexAlias);
    }

    /**
     * @dataProvider indexAliasDataProvider
     *
     * @param string                      $indexIdentifier Index identifier
     * @param LocalizedCatalog|int|string $catalog         Catalog
     * @param string                      $expectedAlias   Expected index alias
     */
    public function testCreateIndexNameFromIdentifier(
        string $indexIdentifier,
        LocalizedCatalog|int|string $catalog,
        string $expectedAlias
    ): void {
        $indexName = $this->indexSettings->createIndexNameFromIdentifier($indexIdentifier, $catalog);
        $this->assertStringStartsWith($expectedAlias, $indexName);
        $this->assertMatchesRegularExpression('/_[0-9]{8}_[0-9]{6}$/', $indexName);
    }

    /**
     * @return array<mixed>
     */
    public function indexAliasDataProvider(): array
    {
        return [
            ['product', 'b2c_fr', 'test_elasticsuite_b2c_fr_product'],
            ['product', 'b2c_en', 'test_elasticsuite_b2c_en_product'],
            ['product', 'b2b_en', 'test_elasticsuite_b2b_en_product'],
            ['category', 'b2c_fr', 'test_elasticsuite_b2c_fr_category'],
            ['category', 'b2c_en', 'test_elasticsuite_b2c_en_category'],
            ['category', 'b2b_en', 'test_elasticsuite_b2b_en_category'],
        ];
    }
}
