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

namespace Elasticsuite\Search\Tests\Api\Rest;

use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class FacetConfigurationTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        static::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
    }

    protected function getApiPath(): string
    {
        return '/facet_configurations';
    }

    /**
     * @dataProvider getCollectionBeforeDataProvider
     */
    public function testGetCollectionBefore(?string $entityType, ?string $categoryId, array $elements): void
    {
        $this->testGetCollection($entityType, $categoryId, $elements);
    }

    protected function getCollectionBeforeDataProvider(): array
    {
        return [
            [
                null,
                null,
                [
                    ['sourceField' => 2, 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                null,
                'cat_1',
                [
                    ['sourceField' => 2, 'category' => 'cat_1', 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'category' => 'cat_1', 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'cat_1', 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'cat_1', 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'cat_1', 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'category' => 'cat_1', 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'category' => 'cat_1', 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'category' => 'cat_1', 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                null,
                'cat_2',
                [
                    ['sourceField' => 2, 'category' => 'cat_2', 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'category' => 'cat_2', 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'cat_2', 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'cat_2', 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'cat_2', 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'category' => 'cat_2', 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'category' => 'cat_2', 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'category' => 'cat_2', 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                'product',
                null,
                [
                    ['sourceField' => 3, 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                'category',
                null,
                [
                    ['sourceField' => 2, 'sourceFieldCode' => 'name'],
                ],
            ],
        ];
    }

    /**
     * @dataProvider updateDataProvider
     * @depends testGetCollectionBefore
     */
    public function testUpdateValue(User $user, string $id, array $newData, int $expectedStatus, ?string $expectedMessage)
    {
        $this->validateApiCall(
            new RequestToTest('PUT', "{$this->getApiPath()}/$id", $user, $newData),
            new ExpectedResponse($expectedStatus, null, $expectedMessage)
        );
    }

    protected function updateDataProvider(): array
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), '3-0', ['coverageRate' => 0], 403, 'Access Denied.'],
            [$admin, '3-0', ['coverageRate' => 0, 'sortOrder' => 'invalidSortOrder'], 422, 'sortOrder: The value you selected is not a valid choice.'],
            [$admin, '3-0', ['coverageRate' => 0, 'sortOrder' => BucketInterface::SORT_ORDER_COUNT], 200],
            [$admin, '3-0', ['coverageRate' => 1, 'maxSize' => 100, 'sortOrder' => BucketInterface::SORT_ORDER_TERM], 200],
            [$admin, '3-cat_1', ['coverageRate' => 10, 'sortOrder' => BucketInterface::SORT_ORDER_RELEVANCE], 200],
            [$admin, '4-cat_1', ['coverageRate' => 10, 'sortOrder' => BucketInterface::SORT_ORDER_MANUAL], 200],
            [$admin, '3-cat_2', ['coverageRate' => 20], 200],
        ];
    }

    /**
     * @dataProvider getCollectionAfterDataProvider
     * @depends testUpdateValue
     */
    public function testGetCollectionAfter(?string $entityType, ?string $categoryId, array $items): void
    {
        $this->testGetCollection($entityType, $categoryId, $items);
    }

    protected function getCollectionAfterDataProvider(): array
    {
        return [
            [
                null,
                null,
                [
                    ['sourceField' => 2, 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'coverageRate' => 1, 'sourceFieldCode' => 'brand', 'maxSize' => 100, 'sortOrder' => BucketInterface::SORT_ORDER_TERM], // product_brand.
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'], // product_color.
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'], // product_category.
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'], // product_length.
                    ['sourceField' => 7, 'sourceFieldCode' => 'size'], // size.
                    ['sourceField' => 8, 'sourceFieldCode' => 'weight'], // weight.
                    ['sourceField' => 15, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                null,
                'cat_1',
                [
                    ['sourceField' => 2, 'category' => 'cat_1', 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'category' => 'cat_1', 'coverageRate' => 10, 'maxSize' => 100, 'defaultCoverageRate' => 1, 'defaultMaxSize' => 100, 'sourceFieldCode' => 'brand', 'sortOrder' => BucketInterface::SORT_ORDER_RELEVANCE, 'defaultSortOrder' => BucketInterface::SORT_ORDER_TERM],
                    ['sourceField' => 4, 'category' => 'cat_1', 'coverageRate' => 10, 'sourceFieldCode' => 'color', 'sortOrder' => BucketInterface::SORT_ORDER_MANUAL],
                    ['sourceField' => 5, 'category' => 'cat_1', 'coverageRate' => 90, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'cat_1', 'coverageRate' => 90, 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'category' => 'cat_1', 'coverageRate' => 90, 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'category' => 'cat_1', 'coverageRate' => 90, 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'category' => 'cat_1', 'coverageRate' => 90, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                null,
                'cat_2',
                [
                    ['sourceField' => 2, 'category' => 'cat_2', 'sourceFieldCode' => 'name'],
                    ['sourceField' => 3, 'category' => 'cat_2', 'coverageRate' => 20, 'maxSize' => 100, 'defaultCoverageRate' => 1,  'defaultMaxSize' => 100, 'sourceFieldCode' => 'brand', 'sortOrder' => BucketInterface::SORT_ORDER_TERM, 'defaultSortOrder' => BucketInterface::SORT_ORDER_TERM],
                    ['sourceField' => 4, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'length'],
                    ['sourceField' => 7, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'size'],
                    ['sourceField' => 8, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'weight'],
                    ['sourceField' => 15, 'category' => 'cat_2', 'coverageRate' => 90, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                'product',
                null,
                [
                    ['sourceField' => 3, 'coverageRate' => 1, 'sourceFieldCode' => 'brand', 'maxSize' => 100, 'sortOrder' => BucketInterface::SORT_ORDER_TERM], // product_brand.
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'], // product_color.
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'], // product_category.
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'], // product_length.
                    ['sourceField' => 7, 'sourceFieldCode' => 'size'], // size.
                    ['sourceField' => 8, 'sourceFieldCode' => 'weight'], // weight.
                    ['sourceField' => 15, 'sourceFieldCode' => 'is_eco_friendly'],
                ],
            ],
            [
                'category',
                null,
                [
                    ['sourceField' => 2, 'sourceFieldCode' => 'name'],
                ],
            ],
        ];
    }

    protected function testGetCollection(?string $entityType, ?string $categoryId, array $items): void
    {
        $query = $entityType ? ["sourceField.metadata.entity=$entityType"] : [];
        if ($categoryId) {
            $query[] = "category=$categoryId";
        }
        $query = empty($query) ? '' : implode('&', $query);

        $this->validateApiCall(
            new RequestToTest('GET', $this->getApiPath() . '?' . $query . '&page=1', $this->getUser(Role::ROLE_CONTRIBUTOR)),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($items) {
                    $this->assertJsonContains(
                        [
                            '@context' => '/contexts/FacetConfiguration',
                            '@id' => '/facet_configurations',
                            '@type' => 'hydra:Collection',
                            'hydra:totalItems' => \count($items),
                        ]
                    );

                    $responseData = $response->toArray();

                    foreach ($items as $item) {
                        $expectedItem = $this->completeContent($item);
                        $item = $this->getById($expectedItem['id'], $responseData['hydra:member']);
                        $this->assertEquals($expectedItem, $item);
                    }
                }
            )
        );
    }

    protected function completeContent(array $data): array
    {
        $sourceFieldId = $data['sourceField'];
        $categoryId = $data['category'] ?? 0;
        unset($data['sourceField']);
        unset($data['category']);
        $id = implode('-', [$sourceFieldId, $categoryId]);

        $baseData = [
            '@id' => "/facet_configurations/$id",
            '@type' => 'FacetConfiguration',
            'id' => $id,
            'sourceField' => "/source_fields/$sourceFieldId",
            'displayMode' => 'auto',
            'coverageRate' => 90,
            'maxSize' => 10,
            'sortOrder' => BucketInterface::SORT_ORDER_COUNT,
            'isRecommendable' => false,
            'isVirtual' => false,
            'defaultDisplayMode' => 'auto',
            'defaultMaxSize' => 10,
            'defaultCoverageRate' => 90,
            'defaultSortOrder' => BucketInterface::SORT_ORDER_COUNT,
            'defaultIsRecommendable' => false,
            'defaultIsVirtual' => false,
        ];

        if ($categoryId) {
            $baseData['category'] = "/categories/$categoryId";
        }

        return array_merge($baseData, $data);
    }

    protected function getById(string $id, array $list): ?array
    {
        foreach ($list as $element) {
            if ($id === $element['id']) {
                return $element;
            }
        }

        return null;
    }
}
