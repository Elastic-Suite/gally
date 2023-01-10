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

namespace Elasticsuite\Metadata\Tests\Unit\EventSubscriber;

use Doctrine\ORM\EntityManager;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Test\AbstractTest;

class SpreadSourceFieldDataTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        static::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
        static::createEntityElasticsearchIndices('product');
        parent::setUpBeforeClass();
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    /**
     * Test if the ES mapping is updated after the save of a source filed.
     */
    public function testUpdateMapping()
    {
        $sourceFieldRepository = static::getContainer()->get(SourceFieldRepository::class);
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $indexRepository = static::getContainer()->get(IndexRepositoryInterface::class);
        $indexSettings = static::getContainer()->get(IndexSettingsInterface::class);
        $metadataRepository = static::getContainer()->get(MetadataRepository::class);
        /** @var EntityManager $entityManager */
        $entityManager = static::getContainer()->get('doctrine')->getManager();

        $metadata = $metadataRepository->findOneBy(['entity' => 'product']);

        // First of all, we check that we don't have fields in the mapping, for the scalar source field 'flag' and complex source field 'category'.
        $localizedCatalogs = $localizedCatalogRepository->findAll();
        foreach ($localizedCatalogs as $localizedCatalog) {
            $indexAlias = $indexSettings->getIndexAliasFromIdentifier($metadata->getEntity(), $localizedCatalog);
            $mappingByIndex = $indexRepository->getMapping($indexAlias);
            foreach ($mappingByIndex as $mapping) {
                $this->assertArrayNotHasKey('fields', $mapping['mappings']['properties']['flag']);
                $this->assertArrayNotHasKey('fields', $mapping['mappings']['properties']['children']['properties']['flag']);
                $this->assertArrayNotHasKey('fields', $mapping['mappings']['properties']['category']['properties']['name']);
                $this->assertArrayNotHasKey('fields', $mapping['mappings']['properties']['category']['properties']['_name']);
            }
        }

        // We set the source fields 'flag' and 'category' as filterable and sortable.
        $flagSourceField = $sourceFieldRepository->findOneBy(['code' => 'flag']);
        $flagSourceField->setIsFilterable(true);
        $flagSourceField->setIsSortable(true);
        $entityManager->persist($flagSourceField);

        $flagSourceField = $sourceFieldRepository->findOneBy(['code' => 'category']);
        $flagSourceField->setIsFilterable(true);
        $flagSourceField->setIsSortable(true);
        $flagSourceField->setIsSearchable(true);
        $entityManager->persist($flagSourceField);
        $entityManager->flush();

        // We check that 'standard', 'untouched' and 'sortable' fields have been added in the mapping for the source fields 'flag' and 'category'.
        foreach ($localizedCatalogs as $localizedCatalog) {
            $indexAlias = $indexSettings->getIndexAliasFromIdentifier($metadata->getEntity(), $localizedCatalog);
            $mappingByIndex = $indexRepository->getMapping($indexAlias);
            foreach ($mappingByIndex as $mapping) {
                $this->assertArrayHasKey('standard', $mapping['mappings']['properties']['flag']['fields']);
                $this->assertArrayHasKey('untouched', $mapping['mappings']['properties']['flag']['fields']);
                $this->assertArrayHasKey('sortable', $mapping['mappings']['properties']['flag']['fields']);

                $this->assertArrayHasKey('standard', $mapping['mappings']['properties']['children']['properties']['flag']['fields']);
                $this->assertArrayHasKey('untouched', $mapping['mappings']['properties']['children']['properties']['flag']['fields']);
                $this->assertArrayHasKey('sortable', $mapping['mappings']['properties']['children']['properties']['flag']['fields']);

                $this->assertArrayHasKey('standard', $mapping['mappings']['properties']['category']['properties']['name']['fields']);
                $this->assertArrayHasKey('untouched', $mapping['mappings']['properties']['category']['properties']['name']['fields']);
                // isSortable is *not* white-listed for any inner text field.
                $this->assertArrayNotHasKey('sortable', $mapping['mappings']['properties']['category']['properties']['name']['fields']);
                $this->assertArrayNotHasKey('sortable', $mapping['mappings']['properties']['category']['properties']['_name']['fields']);
                // isSearchable is only transferred to _name and not name.
                $this->assertArrayNotHasKey('copy_to', $mapping['mappings']['properties']['category']['properties']['name']);
                $this->assertArrayHasKey('copy_to', $mapping['mappings']['properties']['category']['properties']['_name']);
            }
        }
    }
}
