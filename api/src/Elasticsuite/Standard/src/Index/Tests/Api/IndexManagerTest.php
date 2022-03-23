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

namespace Elasticsuite\Index\Tests\Api;

use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Index\Repository\Metadata\MetadataRepository;
use Elasticsuite\Index\Service\IndexManager;

class IndexManagerTest extends AbstractTest
{
    protected IndexManager $indexManager;
    protected MetadataRepository $metadataRepository;
    protected ObjectManager $entityManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->indexManager = static::getContainer()->get(IndexManager::class);
        $this->metadataRepository = static::getContainer()->get(MetadataRepository::class);
        $this->entityManager = static::getContainer()->get('doctrine')->getManager();
        $this->loadFixture([
            __DIR__ . '/../fixtures/catalogs.yaml',
            __DIR__ . '/../fixtures/metadata.yaml',
            __DIR__ . '/../fixtures/source_field.yaml',
            __DIR__ . '/../fixtures/source_field_option.yaml',
        ]);
    }

    /**
     * @dataProvider mappingDataProvider
     */
    public function testGetMapping(string $entity, array $expectedMapping): void
    {
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entity]);
        $this->entityManager->refresh($metadata); // Flush entity in order to avoid empty relations
        $this->assertEquals($expectedMapping, $this->indexManager->getMapping($metadata)->asArray());
    }

    public function mappingDataProvider(): array
    {
        return [
            [
                'product',
                [
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'sku' => ['type' => 'keyword'],
                        'price' => ['type' => 'double'],
                        'stock' => [
                            'type' => 'nested',
                            'properties' => [
                                'status' => ['type' => 'boolean'],
                                'quantity' => ['type' => 'double'],
                            ],
                        ],
                        'name' => ['type' => 'text'],
                        'brand' => ['type' => 'text'],
                    ],
                ],
            ],
            [
                'category',
                [
                    'properties' => [
                        'name' => ['type' => 'text'],
                        'description' => ['type' => 'text'],
                    ],
                ],
            ],
        ];
    }
}
