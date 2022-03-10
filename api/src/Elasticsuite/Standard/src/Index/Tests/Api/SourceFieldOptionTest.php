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

use Elasticsuite\Index\Model\SourceFieldOption;

class SourceFieldOptionTest extends AbstractEntityTest
{
    protected function getEntityClass(): string
    {
        return SourceFieldOption::class;
    }

    protected function getApiPath(): string
    {
        return '/source_field_options';
    }

    protected function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../fixtures/metadata.yaml',
            __DIR__ . '/../fixtures/source_field.yaml',
            __DIR__ . '/../fixtures/source_field_option.yaml',
        ];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return [
            '@context' => '/contexts/SourceFieldOption',
            '@type' => 'SourceFieldOption',
        ];
    }

    protected function getJsonCollectionValidation(): array
    {
        return [
            '@context' => '/contexts/SourceFieldOption',
            '@id' => '/source_field_options',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 4,
        ];
    }

    public function validDataProvider(): array
    {
        return [
            [['sourceField' => '/source_fields/4', 'position' => 10]],
            [['sourceField' => '/source_fields/4']],
        ];
    }

    public function invalidDataProvider(): array
    {
        return [
            [['position' => 3], 'sourceField: This value should not be blank.'],
        ];
    }
}
