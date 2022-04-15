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
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class SourceFieldOptionLabelTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/source_field_option.yaml',
            __DIR__ . '/../../fixtures/source_field_option_label.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return SourceFieldOptionLabel::class;
    }

    protected function getApiPath(): string
    {
        return '/source_field_option_labels';
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/SourceFieldOptionLabel',
            '@type' => 'SourceFieldOptionLabel',
            'label' => $validData['label'],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        return [
            '@context' => '/contexts/SourceFieldOptionLabel',
            '@id' => '/source_field_option_labels/' . $expectedData['id'],
            '@type' => 'SourceFieldOptionLabel',
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/SourceFieldOptionLabel',
            '@id' => '/source_field_option_labels',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 4,
        ];
    }

    public function createValidDataProvider(): array
    {
        return [
            [['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/3', 'label' => 'Marque 3']],
            [['catalog' => '/localized_catalogs/2', 'sourceFieldOption' => '/source_field_options/3', 'label' => 'Brand 3']],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/4'],
                'label: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/1', 'label' => 'Marque 1 Update'],
                'sourceFieldOption: A label is already defined for this option and this catalog.',
            ],
            [
                ['sourceFieldOption' => '/source_field_options/4', 'label' => 'Marque'],
                'catalog: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'label' => 'Marque'],
                'sourceFieldOption: This value should not be blank.',
            ],
            [
                ['catalog' => '/localized_catalogs/NotExist', 'sourceFieldOption' => '/source_field_options/4', 'label' => 'Marque 3'],
                'Item not found for "/localized_catalogs/NotExist".',
                400,
            ],
            [
                ['catalog' => '/localized_catalogs/1', 'sourceFieldOption' => '/source_field_options/NotExist', 'label' => 'Marque 3'],
                'Item not found for "/source_field_options/NotExist".',
                400,
            ],
        ];
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'label' => 'Marque 1'], 200],
            [3, ['id' => 3, 'label' => 'Brand 1'], 200],
            [20, [], 404],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [3, 200],
            [20, 404],
        ];
    }
}
