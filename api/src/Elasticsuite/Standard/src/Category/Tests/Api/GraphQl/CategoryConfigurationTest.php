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

namespace Elasticsuite\Category\Tests\Api\GraphQl;

use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategoryConfigurationTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/configurations.yaml',
        ]);
    }

    /**
     * @dataProvider getWithContextDataProvider
     */
    public function testGetWithContext(string $categoryId, ?string $catalogCode, ?string $localizedCatalogCode, array $expectedData): void
    {
        $catalogRepository = static::getContainer()->get(CatalogRepository::class);
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);

        $catalogId = $catalogCode
            ? $catalogRepository->findOneBy(['code' => $catalogCode])?->getId()
            : 'null';
        $localizedCatalogId = $localizedCatalogCode
            ? $localizedCatalogRepository->findOneBy(['code' => $localizedCatalogCode])?->getId()
            : 'null';

        // Fake id for invalid catalog
        $catalogId = $catalogId ?: '123456';
        $localizedCatalogId = $localizedCatalogId ?: '123456';

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        getCategoryConfiguration(
                          categoryId: "$categoryId"
                          catalogId: {$catalogId}
                          localizedCatalogId: {$localizedCatalogId}
                        ) {
                          name
                          isVirtual
                        }
                  }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedData) {
                    $this->assertJsonContains($expectedData);
                }
            )
        );
    }

    protected function getWithContextDataProvider(): iterable
    {
        yield [
            'fake_category',
            'fake_catalog',
            'fake_localized_catalog',
            ['errors' => [['debugMessage' => 'Category with id fake_category not found.']]],
        ];
        yield [
            'one',
            'fake_catalog',
            'fake_localized_catalog',
            ['errors' => [['debugMessage' => 'Catalog with id 123456 not found.']]],
        ];
        yield [
            'one',
            'b2c',
            'fake_localized_catalog',
            ['errors' => [['debugMessage' => 'Localized catalog with id 123456 not found.']]],
        ];
        yield [
            'one',
            'b2c',
            'b2c_fr',
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'Un',
                        'isVirtual' => true,
                    ],
                ],
            ],
        ];
        yield [
            'one',
            'b2c',
            'b2c_en',
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'One',
                        'isVirtual' => false,
                    ],
                ],
            ],
        ];
        yield [
            'one',
            'b2c',
            null,
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'Un',
                        'isVirtual' => false,
                    ],
                ],
            ],
        ];
        yield [
            'one',
            'b2b',
            null,
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'One',
                        'isVirtual' => true,
                    ],
                ],
            ],
        ];
        yield [
            'one',
            null,
            null,
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'Un',
                        'isVirtual' => true,
                    ],
                ],
            ],
        ];
        yield [
            'five',
            null,
            null,
            [
                'data' => [
                    'getCategoryConfiguration' => [
                        'name' => 'Five',
                        'isVirtual' => false,
                    ],
                ],
            ],
        ];
    }
}
