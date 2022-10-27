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
use Elasticsuite\Test\AbstractTest;

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
            __DIR__ . '/../fixtures/source_field_option.yaml',
            __DIR__ . '/../fixtures/source_field.yaml',
            __DIR__ . '/../fixtures/metadata.yaml',
        ]);
    }

    /**
     * @dataProvider mappingDataProvider
     */
    public function testGetMapping(string $entity, array $expectedMapping): void
    {
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entity]);
        $this->entityManager->refresh($metadata); // Flush entity in order to avoid empty relations
        $actualMapping = $this->metadataManager->getMapping($metadata)->asArray();
        $this->assertEquals($expectedMapping, $actualMapping);
    }

    public function mappingDataProvider(): array
    {
        return [
            [
                'product',
                [
                    'properties' => [
                        'id' => ['type' => 'integer'],
                        'sku' => [
                            'type' => 'text',
                            'analyzer' => 'keyword',
                            'norms' => false,
                        ],
                        'price' => [
                            'type' => 'nested',
                            'properties' => [
                                'original_price' => ['type' => 'double'],
                                'price' => ['type' => 'double'],
                                'is_discounted' => ['type' => 'boolean'],
                                'group_id' => ['type' => 'keyword'],
                            ],
                        ],
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
                                'whitespace' => [
                                    'type' => 'text',
                                    'analyzer' => 'whitespace',
                                ],
                                'shingle' => [
                                    'type' => 'text',
                                    'analyzer' => 'shingle',
                                ],
                                'standard' => [
                                    'type' => 'text',
                                    'analyzer' => 'standard',
                                ],
                            ],
                            'analyzer' => 'keyword',
                            'copy_to' => ['search'],
                            'norms' => false,
                        ],
                        'brand' => [
                            'type' => 'nested',
                            'properties' => [
                                'value' => [
                                    'type' => 'keyword',
                                ],
                                'label' => [
                                    'type' => 'text',
                                    'analyzer' => 'keyword',
                                    'norms' => false,
                                ],
                            ],
                        ],
                        'search' => [
                            'type' => 'text',
                            'analyzer' => 'standard',
                            'fields' => [
                                'whitespace' => [
                                    'type' => 'text',
                                    'analyzer' => 'whitespace',
                                ],
                                'shingle' => [
                                    'type' => 'text',
                                    'analyzer' => 'shingle',
                                ],
                            ],
                        ],
                        'spelling' => [
                            'type' => 'text',
                            'analyzer' => 'standard',
                            'fields' => [
                                'whitespace' => [
                                    'type' => 'text',
                                    'analyzer' => 'whitespace',
                                ],
                                'shingle' => [
                                    'type' => 'text',
                                    'analyzer' => 'shingle',
                                ],
                                'phonetic' => [
                                    'type' => 'text',
                                    'analyzer' => 'phonetic',
                                ],
                            ],
                        ],
                        'children' => [
                            'type' => 'object',
                            'properties' => [
                                'sku' => [
                                    'type' => 'text',
                                    'analyzer' => 'keyword',
                                    'norms' => false,
                                ],
                                'name' => [
                                    'type' => 'text',
                                    'fields' => [
                                        'whitespace' => [
                                            'type' => 'text',
                                            'analyzer' => 'whitespace',
                                        ],
                                        'shingle' => [
                                            'type' => 'text',
                                            'analyzer' => 'shingle',
                                        ],
                                        'standard' => [
                                            'type' => 'text',
                                            'analyzer' => 'standard',
                                        ],
                                    ],
                                    'analyzer' => 'keyword',
                                    'copy_to' => ['search'],
                                    'norms' => false,
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
                            'analyzer' => 'keyword',
                            'norms' => false,
                        ],
                        'description' => [
                            'type' => 'text',
                            'analyzer' => 'keyword',
                            'copy_to' => ['search', 'spelling'],
                            'fields' => [
                                'standard' => [
                                    'type' => 'text',
                                    'analyzer' => 'standard',
                                ],
                            ],
                            'norms' => false,
                        ],
                        // No 'short_description' on purpose because no 'type' on source field.
                        'search' => [
                            'type' => 'text',
                            'analyzer' => 'standard',
                            'fields' => [
                                'whitespace' => [
                                    'type' => 'text',
                                    'analyzer' => 'whitespace',
                                ],
                                'shingle' => [
                                    'type' => 'text',
                                    'analyzer' => 'shingle',
                                ],
                            ],
                        ],
                        'spelling' => [
                            'type' => 'text',
                            'analyzer' => 'standard',
                            'fields' => [
                                'whitespace' => [
                                    'type' => 'text',
                                    'analyzer' => 'whitespace',
                                ],
                                'shingle' => [
                                    'type' => 'text',
                                    'analyzer' => 'shingle',
                                ],
                                'phonetic' => [
                                    'type' => 'text',
                                    'analyzer' => 'phonetic',
                                ],
                            ],
                        ],
                        'children' => [
                            'type' => 'object',
                            'properties' => [
                                'name' => [
                                    'type' => 'text',
                                    'analyzer' => 'keyword',
                                    'norms' => false,
                                ],
                                'description' => [
                                    'type' => 'text',
                                    'analyzer' => 'keyword',
                                    'copy_to' => ['search', 'spelling'],
                                    'fields' => [
                                        'standard' => [
                                            'type' => 'text',
                                            'analyzer' => 'standard',
                                        ],
                                    ],
                                    'norms' => false,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
