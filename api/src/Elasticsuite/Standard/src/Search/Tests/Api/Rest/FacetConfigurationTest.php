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

namespace Elasticsuite\Search\Tests\Api\Rest;

use Elasticsuite\Search\Model\Facet;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class FacetConfigurationTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/facet_configurations.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return Facet\Configuration::class;
    }

    public function createValidDataProvider(): array
    {
        return [
            [[
                'sourceField' => '/source_fields/4',
                'displayMode' => 'auto',
                'coverageRate' => 20,
                'sortOrder' => 'name',
            ]],
            [[
                'sourceField' => '/source_fields/4',
                'category' => '/categories/2',
                'displayMode' => 'displayed',
                'sortOrder' => 'admin_sort',
            ]],
            [[
                'sourceField' => '/source_fields/5',
                'displayMode' => 'hidden',
                'coverageRate' => 40,
                'sortOrder' => 'relevance',
                'isRecommendable' => false,
                'isVirtual' => false,
            ]],
            [[
                'sourceField' => '/source_fields/6',
                'coverageRate' => 40,
            ]],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [
                [
                    'category' => '/categories/2',
                    'displayMode' => 'auto',
                ],
                'sourceField: This value should not be null.',
            ],
            [
                [
                    'sourceField' => '/source_fields/notValid',
                ],
                'Item not found for "/source_fields/notValid".',
                400,
            ],
            [
                [
                    'sourceField' => '/source_fields/1',
                ],
                'sourceField: The sourceField "name" is not filterable.',
            ],
            [
                [
                    'sourceField' => '/source_fields/2',
                ],
                'sourceField: The sourceField "name" is not linked to a product metadata.',
            ],
            [
                [
                    'sourceField' => '/source_fields/4',
                    'category' => '/categories/notValid',
                    'coverageRate' => 20,
                ],
                'Item not found for "/categories/notValid".',
                400,
            ],
            [
                [
                    'sourceField' => '/source_fields/4',
                    'category' => '/categories/2',
                    'coverageRate' => 30,
                ],
                'sourceField: A facet configuration already exist for this field and category.',
            ],
            [
                [
                    'sourceField' => '/source_fields/4',
                    'displayMode' => 'auto',
                    'coverageRate' => 50,
                ],
                'sourceField: A facet configuration already exist for this field and category.',
            ],
            [
                [
                    'sourceField' => '/source_fields/5',
                    'category' => '/categories/2',
                    'displayMode' => 'unvalid',
                ],
                'displayMode: The value you selected is not a valid choice.',
            ],
            [
                [
                    'sourceField' => '/source_fields/5',
                    'category' => '/categories/2',
                    'coverageRate' => 120,
                ],
                'coverageRate: You must set a value between 0% and 100%.',
            ],
            [
                [
                    'sourceField' => '/source_fields/5',
                    'category' => '/categories/2',
                    'maxSize' => -10,
                ],
                'maxSize: This value should be positive.',
            ],
            [
                [
                    'sourceField' => '/source_fields/5',
                    'category' => '/categories/2',
                    'sortOrder' => 'unvalid',
                ],
                'sortOrder: The value you selected is not a valid choice.',
            ],
        ];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        return array_filter([
            'sourceField' => $validData['sourceField'] ?? null,
            'category' => $validData['category'] ?? null,
            'displayMode' => $validData['displayMode'] ?? null,
            'coverageRate' => $validData['coverageRate'] ?? null,
            'maxSize' => $validData['maxSize'] ?? null,
            'sortOrder' => $validData['sortOrder'] ?? null,
            'recommendable' => $validData['isRecommendable'] ?? null,
            'virtual' => $validData['isVirtual'] ?? null,
        ]);
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'coverageRate' => 10], 200],
            [6, ['id' => 6, 'coverageRate' => 40], 200],
            [20, [], 404],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        return $expectedData;
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [2, 200],
            [20, 404],
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return [
            'hydra:totalItems' => 4,
        ];
    }
}
