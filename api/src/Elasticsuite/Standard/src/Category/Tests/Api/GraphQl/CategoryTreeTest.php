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

namespace Elasticsuite\Index\Tests\Api\GraphQl;

use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Standard\src\Test\AbstractTest;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategoryTreeTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/configurations.yaml',
        ]);
    }

    public function testGetCategoryTree(): void
    {
        $this->assertSame(
            [
                'categories' => [
                    [
                        'id' => 'one',
                        'name' => 'Un',
                        'level' => 1,
                        'path' => 'one',
                        'isVirtual' => true,
                        'children' => [
                            [
                                'id' => 'three',
                                'name' => 'Trois',
                                'level' => 2,
                                'path' => 'one/three',
                                'isVirtual' => null,
                            ],
                        ],
                    ],
                ],
            ],
            $this->getCategoryTree('b2c', 'b2c_fr')
        );

        $this->assertSame(
            [
                'categories' => [
                    [
                        'id' => 'one',
                        'name' => 'One',
                        'level' => 1,
                        'path' => 'one',
                        'isVirtual' => false,
                        'children' => [
                            [
                                'id' => 'three',
                                'name' => 'Three',
                                'level' => 2,
                                'path' => 'one/three',
                                'isVirtual' => null,
                            ],
                        ],
                    ],
                    [
                        'id' => 'two',
                        'name' => 'Two',
                        'level' => 1,
                        'path' => 'two',
                        'isVirtual' => null,
                    ],
                ],
            ],
            $this->getCategoryTree('b2c', 'b2c_en')
        );

        $this->assertSame(
            [
                'categories' => [
                    [
                        'id' => 'five',
                        'name' => 'Five',
                        'level' => 1,
                        'path' => 'five',
                        'isVirtual' => null,
                    ],
                ],
            ],
            $this->getCategoryTree('b2b')
        );

        $this->assertSame(
            [
                'categories' => [
                    [
                        'id' => 'one',
                        'name' => 'Un',
                        'level' => 1,
                        'path' => 'one',
                        'isVirtual' => true,
                        'children' => [
                            [
                                'id' => 'three',
                                'name' => 'Trois',
                                'level' => 2,
                                'path' => 'one/three',
                                'isVirtual' => null,
                            ],
                        ],
                    ],
                    [
                        'id' => 'two',
                        'name' => 'Deux',
                        'level' => 1,
                        'path' => 'two',
                        'isVirtual' => null,
                    ],
                ],
            ],
            $this->getCategoryTree()
        );
    }

    private function getCategoryTree(?string $catalogCode = null, ?string $localizedCatalogCode = null): array
    {
        $responseData = [];
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $catalogRepository = static::getContainer()->get(CatalogRepository::class);

        $params = [];
        if ($catalogCode) {
            $params[] = 'catalogId:'
                . $catalogRepository->findOneBy(['code' => $catalogCode])->getId();
        }
        if ($localizedCatalogCode) {
            $params[] = 'localizedCatalogId:'
                . $localizedCatalogRepository->findOneBy(['code' => $localizedCatalogCode])->getId();
        }

        $query = !empty($params) ? '(' . implode(',', $params) . ')' : '';

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                      getCategoryTree $query {
                        categories
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_ADMIN),
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use (&$responseData) {
                    $responseData = $response->toArray()['data']['getCategoryTree'];
                }
            )
        );

        return $responseData;
    }
}
