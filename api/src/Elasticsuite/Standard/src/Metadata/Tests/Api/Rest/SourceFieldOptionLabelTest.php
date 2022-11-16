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

use Elasticsuite\Metadata\Model\SourceFieldOptionLabel;
use Elasticsuite\Test\AbstractEntityTest;
use Elasticsuite\User\Constant\Role;

class SourceFieldOptionLabelTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field_option_label.yaml',
            __DIR__ . '/../../fixtures/source_field_option.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return SourceFieldOptionLabel::class;
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/3', 'label' => 'Marque 3'], 403],
            [$adminUser, ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/3', 'label' => 'Marque 3'], 201],
            [$adminUser, ['catalog' => '/localized_catalogs/2', 'sourceFieldOption' => '/source_field_options/3', 'label' => 'Brand 3'], 201],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/4'],
                422,
                'label: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/1', 'label' => 'Marque 1 Update'],
                422,
                'sourceFieldOption: A label is already defined for this option and this catalog.',
            ],
            [
                $adminUser,
                ['sourceFieldOption' => '/source_field_options/4', 'label' => 'Marque'],
                422,
                'catalog: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'label' => 'Marque'],
                422,
                'sourceFieldOption: This value should not be blank.',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/NotExist', 'sourceFieldOption' => '/source_field_options/4', 'label' => 'Marque 3'],
                400,
                'Item not found for "/localized_catalogs/NotExist".',
            ],
            [
                $adminUser,
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/NotExist', 'label' => 'Marque 3'],
                400,
                'Item not found for "/source_field_options/NotExist".',
            ],
        ];
    }

    protected function getJsonCreationValidation(array $expectedData): array
    {
        $expectedData['sourceFieldOption'] = [
            '@id' => $expectedData['sourceFieldOption'],
            '@type' => 'SourceFieldOption',
            'code' => '3',
        ];

        return $expectedData;
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        return [
            [$user, 1, ['id' => 1, 'label' => 'Marque 1'], 200],
            [$user, 3, ['id' => 3, 'label' => 'Brand 1'], 200],
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
            [$adminUser, 3, 204],
            [$adminUser, 20, 404],
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
