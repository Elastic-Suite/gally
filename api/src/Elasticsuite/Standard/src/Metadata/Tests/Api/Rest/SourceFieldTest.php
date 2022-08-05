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
use Elasticsuite\Standard\src\Test\AbstractEntityTest;
use Elasticsuite\User\Constant\Role;

class SourceFieldTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
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
            [$adminUser, ['code' => 'length', 'isSearchable' => true, 'metadata' => '/metadata/1'], 201],
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
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'code' => 'name'], 200],
            [$user, 10, ['id' => 10, 'code' => 'description'], 200],
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
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 11, 200],
        ];
    }
}
