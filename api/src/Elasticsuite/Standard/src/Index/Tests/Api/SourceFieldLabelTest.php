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

namespace Elasticsuite\Index\Tests\Api;

use Elasticsuite\Index\Model\SourceFieldLabel;

class SourceFieldLabelTest extends AbstractEntityTest
{
    protected function getEntityClass(): string
    {
        return SourceFieldLabel::class;
    }

    protected function getApiPath(): string
    {
        return '/source_field_labels';
    }

    protected function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../fixtures/catalogs.yaml',
            __DIR__ . '/../fixtures/metadata.yaml',
            __DIR__ . '/../fixtures/source_field.yaml',
            __DIR__ . '/../fixtures/source_field_label.yaml',
        ];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/SourceFieldLabel',
            '@type' => 'SourceFieldLabel',
            'label' => $validData['label'],
        ];
    }

    protected function getJsonCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/SourceFieldLabel',
            '@id' => '/source_field_labels',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ];
    }

    public function validDataProvider(): array
    {
        return [
            [['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/3', 'label' => 'Prix']],
            [['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/3', 'label' => 'Price']],
            [['catalog' => '/localized_catalogs/1', 'sourceField' => '/source_fields/2', 'label' => 'Nom']],
            [['catalog' => '/localized_catalogs/2', 'sourceField' => '/source_fields/2', 'label' => 'Name']],
        ];
    }

    public function invalidDataProvider(): array
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
}
