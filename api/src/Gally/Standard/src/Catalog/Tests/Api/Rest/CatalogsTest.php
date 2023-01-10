<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Catalog\Tests\Api\Rest;

use Gally\Catalog\Model\Catalog;
use Gally\Test\AbstractEntityTest;
use Gally\User\Constant\Role;

class CatalogsTest extends AbstractEntityTest
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
            [
                $user,
                1,
                [
                    'id' => 1,
                    'code' => 'b2c_test',
                    'name' => 'B2C Test Catalog',
                    'localizedCatalogs' => [
                        [
                            '@id' => '/localized_catalogs/1',
                            '@type' => 'LocalizedCatalog',
                            'id' => 1,
                            'name' => 'B2C French Store View',
                            'code' => 'b2c_fr',
                            'locale' => 'fr_FR',
                            'isDefault' => false,
                            'localName' => 'French (France)',
                        ],
                        [
                            '@id' => '/localized_catalogs/2',
                            '@type' => 'LocalizedCatalog',
                            'id' => 2,
                            'name' => 'B2C English Store View',
                            'code' => 'b2c_en',
                            'locale' => 'en_US',
                            'isDefault' => false,
                            'localName' => 'English (United States)',
                        ],
                    ],
                ],
                200,
                'en_US',
            ],
            [
                $user,
                1,
                [
                    'id' => 1,
                    'localizedCatalogs' => [
                        [
                            'localName' => 'français (France)',
                        ],
                        [
                            'localName' => 'anglais (États-Unis)',
                        ],
                    ],
                ],
                200,
                'fr_FR',
            ],
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
