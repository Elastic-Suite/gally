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

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;
use Elasticsuite\User\Constant\Role;

class LocalizedCatalogsTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/localized_catalogs.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return LocalizedCatalog::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'valid_code', 'name' => 'B2C French catalog', 'locale' => 'fr_FR'], 201],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'empty_name', 'name' => '', 'locale' => 'en_US'], 201],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'missing_name', 'locale' => 'fr_FR'], 201],
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['catalog' => '/catalogs/1', 'code' => 'valid_code', 'name' => 'Unauthorized user', 'locale' => 'fr_FR'], 403],
            [$adminUser, ['code' => 'no_catalog', 'name' => 'B2C French catalog', 'locale' => 'fr_FR'], 422, 'catalog: This value should not be blank.'],
            [$adminUser, ['catalog' => '/catalogs/2', 'code' => 'valid_code', 'locale' => 'fr_FR', 'name' => 'Empty Code'], 422, 'locale: This code and locale couple already exists.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => '', 'locale' => 'en_US', 'name' => 'Empty Code'], 422, 'code: This value should not be blank.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => '', 'locale' => 'en_US'], 422, 'code: This value should not be blank.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'locale' => 'en_US', 'name' => 'Missing Code'], 422, 'code: This value should not be blank.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'missing_locale'], 422, 'locale: This value should not be blank.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'cat_1_invalid', 'locale' => 'fr-fr'], 422, 'locale: This value is not valid.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'cat_1_invalid', 'locale' => 'strin'], 422, 'locale: This value is not valid.'],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'cat_1_invalid', 'locale' => 'too_long_locale'], 422, "locale: This value is not valid.\nlocale: This value should have exactly 5 characters."],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'cat_1_invalid', 'locale' => 'a'], 422, "locale: This value is not valid.\nlocale: This value should have exactly 5 characters."],
            [$adminUser, ['catalog' => '/catalogs/1', 'code' => 'cat_1_invalid', 'locale' => 'abc'], 422, "locale: This value is not valid.\nlocale: This value should have exactly 5 characters."],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'code' => 'b2c_fr', 'locale' => 'fr_FR', 'name' => 'B2C French Store View', 'isDefault' => false, 'localName' => 'français (France)'], 200, 'fr_FR'],
            [$user, 5, ['id' => 5, 'code' => 'empty_name', 'locale' => 'en_US', 'localName' => 'English (United States)'], 200, 'en_US'],
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
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 4, 200],
        ];
    }
}
