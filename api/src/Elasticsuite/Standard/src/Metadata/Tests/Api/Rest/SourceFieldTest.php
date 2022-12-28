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

namespace Elasticsuite\Metadata\Tests\Api\Rest;

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Test\AbstractEntityTestWithUpdate;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class SourceFieldTest extends AbstractEntityTestWithUpdate
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/source_field_label.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return SourceField::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['code' => 'description', 'metadata' => '/metadata/1'], 403],
            [$adminUser, ['code' => 'description', 'metadata' => '/metadata/1'], 201],
            [$adminUser, ['code' => 'weight', 'metadata' => '/metadata/1'], 201],
            [$adminUser, ['code' => 'image', 'metadata' => '/metadata/2'], 201],
            [$adminUser, ['code' => 'length', 'isSearchable' => true, 'metadata' => '/metadata/1', 'weight' => 2], 201],
            [$adminUser, ['code' => 'description'], 422, 'metadata: This value should not be blank.'],
            [$adminUser, ['metadata' => '/metadata/1'], 422, 'code: This value should not be blank.'],
            [
                $adminUser,
                ['code' => 'long_description', 'metadata' => '/metadata/1', 'type' => 'description'],
                422,
                'type: The value you selected is not a valid choice.',
            ],
            [
                $adminUser,
                ['code' => 'description', 'metadata' => '/metadata/notExist'],
                400,
                'Item not found for "/metadata/notExist".',
            ],
            [
                $adminUser,
                ['code' => 'name', 'metadata' => '/metadata/1'],
                422,
                'code: An field with this code already exist for this entity.',
            ],
            [
                $adminUser,
                ['code' => 'color', 'isSearchable' => true, 'metadata' => '/metadata/1', 'weight' => 0],
                422,
                'weight: The value you selected is not a valid choice.',
            ],
            [
                $adminUser,
                ['code' => 'color', 'isSearchable' => true, 'metadata' => '/metadata/1', 'weight' => 11],
                422,
                'weight: The value you selected is not a valid choice.',
            ],
            [$adminUser, ['code' => 'my_category', 'metadata' => '/metadata/1', 'type' => 'category'], 201],
            [
                $adminUser,
                ['code' => 'my_category.id', 'metadata' => '/metadata/1', 'type' => 'keyword'],
                500,
                "You can't create a source field with the code 'my_category.id' because a source field with the code 'my_category' exists.",
            ],
            [$adminUser, ['code' => 'my_price.price', 'metadata' => '/metadata/1', 'type' => 'float'], 201],
            [
                $adminUser,
                ['code' => 'my_price', 'metadata' => '/metadata/1', 'type' => 'price'],
                500,
                "You can't create a source field with the code 'my_price' because a source field with the code 'my_price.*' exists.",
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'code' => 'name', 'weight' => 10], 200],
            [$user, 12, ['id' => 12, 'code' => 'description', 'weight' => 1], 200],
            [$user, 15, ['id' => 15, 'code' => 'length', 'weight' => 2], 200],
            [$user, 20, [], 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function deleteDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 1, 403],
            [$adminUser, 1, 204],
            [$adminUser, 5, 400], // Can't remove system source field
            [$adminUser, 10, 204],
            [$adminUser, 20, 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getCollectionDataProvider(): iterable
    {
        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 15, 200],
        ];
    }

    public function updateDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 5, ['weight' => 10, 'isSpellchecked' => true], 403],
            [$adminUser, 5, ['weight' => 10, 'isSpellchecked' => true]],
            [
                $adminUser,
                5,
                ['isFilterable' => true],
                400,
                "The source field 'sku' cannot be updated because it is a system source field, only the value  of 'weight' and 'isSpellchecked' can be changed.",
            ],
            [
                $adminUser,
                5,
                ['isSystem' => false],
                400,
                "The source field 'sku' cannot be updated because it is a system source field, only the value  of 'weight' and 'isSpellchecked' can be changed.",
            ],
        ];
    }

    /**
     * @dataProvider searchColumnsFilterDataProvider
     */
    public function testSearchColumnsFilter(string $search, int $expectedItemNumber): void
    {
        $request = new RequestToTest(
            'GET', $this->getApiPath() . '?defaultLabel=' . $search,
            $this->getUser(Role::ROLE_CONTRIBUTOR)
        );
        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) use ($expectedItemNumber) {
                $shortName = $this->getShortName();
                $this->assertJsonContains(
                    [
                        '@context' => "/contexts/$shortName",
                        '@id' => $this->getApiPath(),
                        '@type' => 'hydra:Collection',
                        'hydra:totalItems' => $expectedItemNumber,
                    ],
                );
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    private function searchColumnsFilterDataProvider(): iterable
    {
        yield ['sku', 1];
        yield ['Name', 2];
        yield ['Nom', 1];
    }
}
