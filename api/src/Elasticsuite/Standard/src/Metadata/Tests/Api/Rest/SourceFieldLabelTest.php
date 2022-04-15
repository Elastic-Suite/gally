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
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class SourceFieldLabelTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/source_field_label.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return SourceFieldLabel::class;
    }

    protected function getApiPath(): string
    {
        return '/source_field_labels';
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/SourceFieldLabel',
            '@type' => 'SourceFieldLabel',
            'label' => $validData['label'],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        return [
            '@context' => '/contexts/SourceFieldLabel',
            '@id' => '/source_field_labels/' . $expectedData['id'],
            '@type' => 'SourceFieldLabel',
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/SourceFieldLabel',
            '@id' => '/source_field_labels',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 4,
        ];
    }

    public function createValidDataProvider(): array
    {
        return [
            [['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/3', 'label' => 'Prix']],
            [['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/3', 'label' => 'Price']],
            [['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/2', 'label' => 'Nom']],
            [['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/2', 'label' => 'Name']],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/4'],
                'label: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/1', 'label' => 'Titre'],
                'sourceField: A label is already defined for this field and this catalog.',
            ],
            [
                ['sourceField' => '/source_fields/4', 'label' => 'Marque'],
                'catalog: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'label' => 'Marque'],
                'sourceField: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/NotExist', 'sourceField' => '/source_fields/4', 'label' => 'Marque'],
                'Item not found for "/localized_catalogs/NotExist".',
                400,
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/NotExist', 'label' => 'Marque'],
                'Item not found for "/source_fields/NotExist".',
                400,
            ],
        ];
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'label' => 'Nom'], 200],
            [2, ['id' => 2, 'label' => 'Name'], 200],
            [10, [], 404],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [2, 200],
            [10, 404],
        ];
    }
}
