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

use Elasticsuite\Metadata\Model\SourceFieldLabel;
use Elasticsuite\Test\AbstractEntityTest;
use Elasticsuite\User\Constant\Role;

class SourceFieldLabelTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field_label.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return SourceFieldLabel::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/3', 'label' => 'Prix'], 403],
            [$adminUser, ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/3', 'label' => 'Prix'], 201],
            [$adminUser, ['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/3', 'label' => 'Price'], 201],
            [$adminUser, ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/2', 'label' => 'Nom'], 201],
            [$adminUser, ['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/2', 'label' => 'Name'], 201],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/4'],
                422,
                'label: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/1', 'label' => 'Titre'],
                422,
                'sourceField: A label is already defined for this field and this catalog.',
            ],
            [
                $adminUser,
                ['sourceField' => '/source_fields/4', 'label' => 'Marque'],
                422,
                'catalog: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'label' => 'Marque'],
                422,
                'sourceField: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/NotExist', 'sourceField' => '/source_fields/4', 'label' => 'Marque'],
                400,
                'Item not found for "/localized_catalogs/NotExist".',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/NotExist', 'label' => 'Marque'],
                400,
                'Item not found for "/source_fields/NotExist".',
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
            [$user, 1, ['id' => 1, 'label' => 'Nom'], 200],
            [$user, 2, ['id' => 2, 'label' => 'Name'], 200],
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
            [$adminUser, 2, 204],
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
