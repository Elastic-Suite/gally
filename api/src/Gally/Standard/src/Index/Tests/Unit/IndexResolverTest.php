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

namespace Gally\Index\Tests\Unit;

use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Index\Service\IndexSettings;
use Gally\Test\AbstractTest;

class IndexResolverTest extends AbstractTest
{
    protected IndexSettings $indexSettings;

    protected function setUp(): void
    {
        parent::setUp();
        $this->indexSettings = static::getContainer()->get('Gally\Index\Service\IndexSettingsTest'); // @phpstan-ignore-line
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
            ['product', 'b2c_fr', 'gally_test__gally_b2c_fr_product'],
            ['product', 'b2c_en', 'gally_test__gally_b2c_en_product'],
            ['product', 'b2b_en', 'gally_test__gally_b2b_en_product'],
            ['category', 'b2c_fr', 'gally_test__gally_b2c_fr_category'],
            ['category', 'b2c_en', 'gally_test__gally_b2c_en_category'],
            ['category', 'b2b_en', 'gally_test__gally_b2b_en_category'],
        ];
    }
}
