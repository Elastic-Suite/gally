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

namespace Elasticsuite\Product\Tests\Unit\Elasticsearch\Request\Aggregation;

use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Product\Elasticsearch\Request\Aggregation\Modifier\Coverage;
use Elasticsuite\Product\Service\SearchSettingsProvider;
use Elasticsuite\Product\Tests\Service\SearchSettingsProvider as TestSearchSettingsProvider;
use Elasticsuite\Test\AbstractTest;

/**
 * Catalog Product Search Request coverage provider.
 */
class CoverageTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../../../fixtures/facet_configuration.yaml',
            __DIR__ . '/../../../../fixtures/source_field_option_label.yaml',
            __DIR__ . '/../../../../fixtures/source_field_option.yaml',
            __DIR__ . '/../../../../fixtures/source_field_label.yaml',
            __DIR__ . '/../../../../fixtures/source_field.yaml',
            __DIR__ . '/../../../../fixtures/category_configurations.yaml',
            __DIR__ . '/../../../../fixtures/categories.yaml',
            __DIR__ . '/../../../../fixtures/catalogs.yaml',
            __DIR__ . '/../../../../fixtures/metadata.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../../../fixtures/product_documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    /**
     * Compute calculation of product counts against the engine.
     *
     * @dataProvider modifySourceFieldsDataProvider
     */
    public function testModifySourceFields(
        bool $coverageUseIndexFieldsProperty,
        array $expectedAggregations
    ): void {
        \assert(static::getContainer()->get(MetadataRepository::class) instanceof MetadataRepository);
        $metadataRepository = static::getContainer()->get(MetadataRepository::class);
        \assert(static::getContainer()->get(LocalizedCatalogRepository::class) instanceof LocalizedCatalogRepository);
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        \assert(static::getContainer()->get(SourceFieldRepository::class) instanceof SourceFieldRepository);
        $sourceFieldRepository = static::getContainer()->get(SourceFieldRepository::class);
        \assert(static::getContainer()->get(Coverage::class) instanceof Coverage);
        $coverage = static::getContainer()->get(Coverage::class);
        \assert(static::getContainer()->get(SearchSettingsProvider::class) instanceof TestSearchSettingsProvider);
        $searchSettings = static::getContainer()->get(SearchSettingsProvider::class);

        $metadata = $metadataRepository->findByEntity('product');
        $localizedCatalog = $localizedCatalogRepository->findOneBy(['code' => 'b2c_en']);
        $sourceFields = $sourceFieldRepository->getFilterableInAggregationFields('product');

        $searchSettings->set('aggregations', ['coverage_use_indexed_fields_property' => $coverageUseIndexFieldsProperty]);
        $sourcesFields = $coverage->modifySourceFields($metadata, $localizedCatalog, $sourceFields, null, [], []);
        $this->assertEquals(
            $expectedAggregations,
            array_map(fn (SourceField $sourceField): string => $sourceField->getCode(), $sourcesFields)
        );
    }

    private function modifySourceFieldsDataProvider(): array
    {
        return [
            [
                false, // coverage_use_indexed_fields_property conf value
                ['color', 'size', 'weight', 'is_eco_friendly', 'category'], //expected aggregation
            ],
            [
                true, // coverage_use_indexed_fields_property conf value
                ['color', 'weight', 'is_eco_friendly', 'category'], // Expected aggregations
            ],
        ];
    }
}
