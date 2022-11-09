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
    public function testGetCollectionBefore(?string $categoryId, array $elements): void
    {
        $this->testGetCollection($categoryId, $elements);
    }

    protected function getCollectionBeforeDataProvider(): array
    {
        return [
            [
                null,
                [
                    ['sourceField' => 3, 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'],
                ],
            ],
            [
                'one',
                [
                    ['sourceField' => 3, 'category' => 'one', 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'one', 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'one', 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'one', 'sourceFieldCode' => 'length'],
                ],
            ],
            [
                'two',
                [
                    ['sourceField' => 3, 'category' => 'two', 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'two', 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'two', 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'two', 'sourceFieldCode' => 'length'],
                ],
            ],
        ];
    }

    /**
     * @dataProvider updateDataProvider
     * @depends testGetCollectionBefore
     */
    public function testUpdateValue(User $user, string $id, array $newData, int $expectedStatus)
    {
        $this->validateApiCall(
            new RequestToTest('PUT', "{$this->getApiPath()}/$id", $user, $newData),
            new ExpectedResponse($expectedStatus)
        );
    }

    protected function updateDataProvider(): array
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), '3-0', ['coverageRate' => 0], 403],
            [$admin, '3-0', ['coverageRate' => 0], 200],
            [$admin, '3-0', ['coverageRate' => 1, 'maxSize' => 100], 200],
            [$admin, '3-one', ['coverageRate' => 10], 200],
            [$admin, '4-one', ['coverageRate' => 10], 200],
            [$admin, '3-two', ['coverageRate' => 20], 200],
        ];
    }

    /**
     * @dataProvider getCollectionAfterDataProvider
     * @depends testUpdateValue
     */
    public function testGetCollectionAfter(?string $categoryId, array $items): void
    {
        $this->testGetCollection($categoryId, $items);
    }

    protected function getCollectionAfterDataProvider(): array
    {
        return [
            [
                null,
                [
                    ['sourceField' => 3, 'coverageRate' => 1, 'sourceFieldCode' => 'brand', 'maxSize' => 100], // product_brand.
                    ['sourceField' => 4, 'sourceFieldCode' => 'color'], // product_color.
                    ['sourceField' => 5, 'sourceFieldCode' => 'category'], // product_category.
                    ['sourceField' => 6, 'sourceFieldCode' => 'length'], // product_length.
                ],
            ],
            [
                'one',
                [
                    ['sourceField' => 3, 'category' => 'one', 'coverageRate' => 10, 'maxSize' => 100, 'defaultCoverageRate' => 1, 'defaultMaxSize' => 100, 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'one', 'coverageRate' => 10, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'one', 'coverageRate' => 90, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'one', 'coverageRate' => 90, 'sourceFieldCode' => 'length'],
                ],
            ],
            [
                'two',
                [
                    ['sourceField' => 3, 'category' => 'two', 'coverageRate' => 20, 'maxSize' => 100, 'defaultCoverageRate' => 1,  'defaultMaxSize' => 100, 'sourceFieldCode' => 'brand'],
                    ['sourceField' => 4, 'category' => 'two', 'coverageRate' => 90, 'sourceFieldCode' => 'color'],
                    ['sourceField' => 5, 'category' => 'two', 'coverageRate' => 90, 'sourceFieldCode' => 'category'],
                    ['sourceField' => 6, 'category' => 'two', 'coverageRate' => 90, 'sourceFieldCode' => 'length'],
                ],
            ],
        ];
    }

    protected function testGetCollection(?string $categoryId, array $items): void
    {
        $query = $categoryId ? "category=$categoryId" : '';
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
                            'hydra:totalItems' => 6,
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
            'sortOrder' => 'result_count',
            'isRecommendable' => false,
            'isVirtual' => false,
            'defaultDisplayMode' => 'auto',
            'defaultMaxSize' => 10,
            'defaultCoverageRate' => 90,
            'defaultSortOrder' => 'result_count',
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
