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

namespace Elasticsuite\Catalog\Tests\Api\Rest;

use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;
use Elasticsuite\User\Constant\Role;

class CatalogsTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [__DIR__ . '/../../fixtures/catalogs.yaml'];
    }

    protected function getEntityClass(): string
    {
        return Catalog::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$adminUser, ['code' => 'valid_code', 'name' => 'B2C Catalog'], 201],
            [$adminUser, ['code' => 'empty_name', 'name' => ''], 201],
            [$adminUser, ['code' => 'missing_name'], 201],
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['code' => 'valid_code', 'name' => 'Unauthorized user'], 403],
            [$adminUser, ['code' => '', 'name' => 'Empty Code'], 422, 'code: This value should not be blank.'],
            [$adminUser, ['code' => ''], 422, 'code: This value should not be blank.'],
            [$adminUser, ['name' => 'Missing Code'], 422, 'code: This value should not be blank.'],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'code' => 'b2c_test', 'name' => 'B2C Test Catalog'], 200],
            [$user, 5, ['id' => 5, 'code' => 'missing_name'], 200],
            [$user, 10, [], 404],
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
            [$adminUser, 5, 204],
            [$adminUser, 10, 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getCollectionDataProvider(): iterable
    {
        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 3, 200],
        ];
    }
}
