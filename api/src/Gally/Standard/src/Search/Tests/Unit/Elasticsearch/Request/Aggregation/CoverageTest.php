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

namespace Gally\Search\Tests\Unit\Elasticsearch\Request\Aggregation;

use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Category\Service\CurrentCategoryProvider;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Elasticsearch\Request\Aggregation\Modifier\Coverage;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Gally\Search\Model\Facet\Configuration;
use Gally\Search\Repository\Facet\ConfigurationRepository;
use Gally\Search\Service\SearchSettingsProvider;
use Gally\Search\Tests\Service\SearchSettingsProvider as TestSearchSettingsProvider;
use Gally\Test\AbstractTest;

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
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../../../fixtures/documents.json']);
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
        $containerConfigurationProvider = static::getContainer()->get(ContainerConfigurationProvider::class);
        \assert(static::getContainer()->get(ContainerConfigurationProvider::class) instanceof ContainerConfigurationProvider);
        $metadataRepository = static::getContainer()->get(MetadataRepository::class);
        \assert(static::getContainer()->get(LocalizedCatalogRepository::class) instanceof LocalizedCatalogRepository);
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        \assert(static::getContainer()->get(ConfigurationRepository::class) instanceof ConfigurationRepository);
        $facetConfigRepository = static::getContainer()->get(ConfigurationRepository::class);
        \assert(static::getContainer()->get(CurrentCategoryProvider::class) instanceof CurrentCategoryProvider);
        $currentCategoryProvider = static::getContainer()->get(CurrentCategoryProvider::class);
        \assert(static::getContainer()->get(Coverage::class) instanceof Coverage);
        $coverage = static::getContainer()->get(Coverage::class);
        \assert(static::getContainer()->get(SearchSettingsProvider::class) instanceof TestSearchSettingsProvider);
        $searchSettings = static::getContainer()->get(SearchSettingsProvider::class);

        $metadata = $metadataRepository->findByEntity('product');
        $localizedCatalog = $localizedCatalogRepository->findOneBy(['code' => 'b2c_en']);
        $containerConfig = $containerConfigurationProvider->get($metadata, $localizedCatalog);

        $currentCategory = $currentCategoryProvider->getCurrentCategory();
        $facetConfigRepository->setCategoryId($currentCategory?->getId());
        $facetConfigRepository->setMetadata($metadata);
        $facetsConfigs = $facetConfigRepository->findAll();

        $searchSettings->set('aggregations', ['coverage_use_indexed_fields_property' => $coverageUseIndexFieldsProperty]);
        $facetsConfigs = $coverage->modifyFacetConfigs($containerConfig, $facetsConfigs, null, [], []);
        $this->assertEquals(
            $expectedAggregations,
            array_map(fn (Configuration $facetsConfig): string => $facetsConfig->getSourceFieldCode(), $facetsConfigs)
        );
    }

    private function modifySourceFieldsDataProvider(): array
    {
        return [
            [
                false, // coverage_use_indexed_fields_property conf value
                ['is_eco_friendly', 'weight', 'category', 'size', 'color'], //expected aggregation
            ],
            [
                true, // coverage_use_indexed_fields_property conf value
                ['is_eco_friendly', 'weight', 'category', 'color'], // Expected aggregations
            ],
        ];
    }
}
