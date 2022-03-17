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

use Elasticsuite\Index\Model\Metadata;

class MetadataTest extends AbstractEntityTest
{
    protected function getEntityClass(): string
    {
        return Metadata::class;
    }

    protected function getApiPath(): string
    {
        return '/metadata';
    }

    protected function getFixtureFiles(): array
    {
        return [__DIR__ . '/../fixtures/metadata.yaml'];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/Metadata',
            '@type' => 'Metadata',
            'entity' => $validData['entity'],
        ];
    }

    protected function getJsonCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/Metadata',
            '@id' => '/metadata',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ];
    }

    public function validDataProvider(): array
    {
        return [
            [['entity' => 'article']],
            [['entity' => 'author']],
        ];
    }

    public function invalidDataProvider(): array
    {
        return [
            [['entity' => ''], 'entity: This value should not be blank.'],
            [['entity' => 'product'], 'entity: This value is already used.'],
            [['entity' => 'category'], 'entity: This value is already used.'],
        ];
    }
}
