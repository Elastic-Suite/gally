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
                $this->assertArrayHasKey('sortable', $mapping['mappings']['properties']['category']['properties']['name']['fields']);
            }
        }
    }
}
