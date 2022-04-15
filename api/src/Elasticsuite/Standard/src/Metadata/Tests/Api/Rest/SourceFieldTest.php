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

    protected function getApiPath(): string
    {
        return '/source_fields';
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        $json = [
            '@context' => '/contexts/SourceField',
            '@type' => 'SourceField',
            'name' => $validData['name'],
        ];

        if (isset($validData['isSearchable'])) {
            $json['searchable'] = $validData['isSearchable'];
        }

        return $json;
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        return [
            '@context' => '/contexts/SourceField',
            '@id' => '/source_fields/' . $expectedData['id'],
            '@type' => 'SourceField',
            'name' => $expectedData['name'],
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/SourceField',
            '@id' => '/source_fields',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 11,
        ];
    }

    public function createValidDataProvider(): array
    {
        return [
            [['name' => 'description', 'metadata' => '/metadata/1']],
            [['name' => 'weight', 'metadata' => '/metadata/1']],
            [['name' => 'image', 'metadata' => '/metadata/2']],
            [['name' => 'length', 'isSearchable' => true, 'metadata' => '/metadata/1']],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [['name' => 'description'], 'metadata: This value should not be blank.'],
            [['metadata' => '/metadata/1'], 'name: This value should not be blank.'],
            [['name' => 'long_description', 'metadata' => '/metadata/1', 'type' => 'description'], 'type: The value you selected is not a valid choice.'],
            [['name' => 'description', 'metadata' => '/metadata/notExist'], 'Item not found for "/metadata/notExist".', 400],
            [['name' => 'name', 'metadata' => '/metadata/1'], 'name: An field with this name already exist for this entity.'],
        ];
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'name' => 'name'], 200],
            [10, ['id' => 10, 'name' => 'description'], 200],
            [20, [], 404],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [5, 400], // Can't remove system source field
            [10, 200],
            [20, 404],
        ];
    }
}
