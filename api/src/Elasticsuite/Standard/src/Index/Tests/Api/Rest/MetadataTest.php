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

namespace Elasticsuite\Index\Tests\Api\Rest;

use Elasticsuite\Index\Model\Metadata;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class MetadataTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [__DIR__ . '/../../fixtures/metadata.yaml'];
    }

    protected function getEntityClass(): string
    {
        return Metadata::class;
    }

    protected function getApiPath(): string
    {
        return '/metadata';
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/Metadata',
            '@type' => 'Metadata',
            'entity' => $validData['entity'],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        return [
            '@context' => '/contexts/Metadata',
            '@id' => '/metadata/' . $expectedData['id'],
            '@type' => 'Metadata',
            'entity' => $expectedData['entity'],
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/Metadata',
            '@id' => '/metadata',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ];
    }

    public function createValidDataProvider(): array
    {
        return [
            [['entity' => 'article']],
            [['entity' => 'author']],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [['entity' => ''], 'entity: This value should not be blank.'],
            [['entity' => 'product'], 'entity: This value is already used.'],
            [['entity' => 'category'], 'entity: This value is already used.'],
        ];
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'entity' => 'product'], 200],
            [3, ['id' => 3, 'entity' => 'article'], 200],
            [5, [], 404],
        ];
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [3, 200],
            [5, 404],
        ];
    }
}
