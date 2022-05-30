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

namespace Elasticsuite\Index\Tests\Unit;

use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Index\Service\MetadataManager;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Standard\src\Test\AbstractTest;

class IndexManagerTest extends AbstractTest
{
    protected MetadataManager $metadataManager;
    protected MetadataRepository $metadataRepository;
    protected ObjectManager $entityManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->metadataManager = static::getContainer()->get(MetadataManager::class);
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
        $this->assertEquals($expectedMapping, $this->metadataManager->getMapping($metadata)->asArray());
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
                                'status' => ['type' => 'integer'],
                                'qty' => ['type' => 'double'],
                            ],
                        ],
                        'name' => [
                            'type' => 'text',
                            'fields' => [
                                'untouched' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256,
                                ],
                            ],
                        ],
                        'brand' => [
                            'type' => 'text',
                            'fields' => [
                                'untouched' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            [
                'category',
                [
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'name' => [
                            'type' => 'text',
                            'fields' => [
                                'untouched' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256,
                                ],
                            ],
                        ],
                        'description' => [
                            'type' => 'text',
                            'fields' => [
                                'untouched' => [
                                    'type' => 'keyword',
                                    'ignore_above' => 256,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
