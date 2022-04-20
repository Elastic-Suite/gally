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

namespace Elasticsuite\Catalog\Tests\Api\Rest;

use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;

class CatalogsTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [__DIR__ . '/../../fixtures/catalogs.yaml'];
    }

    protected function getEntityClass(): string
    {
        return Catalog::class;
    }

    public function createValidDataProvider(): array
    {
        return [
            [['code' => 'valid_code', 'name' => 'B2C Catalog']],
            [['code' => 'empty_name', 'name' => '']],
            [['code' => 'missing_name']],
        ];
    }

    public function createInvalidDataProvider(): array
    {
        return [
            [['code' => '', 'name' => 'Empty Code'], 'code: This value should not be blank.'],
            [['code' => ''], 'code: This value should not be blank.'],
            [['name' => 'Missing Code'], 'code: This value should not be blank.'],
        ];
    }

    protected function getJsonCreationValidation(array $validData): array
    {
        $data = [
            'code' => $validData['code'],
        ];

        if (isset($validData['name'])) {
            $data['name'] = $validData['name'];
        }

        return $data;
    }

    public function testGetCollection(): void
    {
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('GET', '/catalogs', ['auth_bearer' => $loginJson['token']]);

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains(
            [
                '@context' => '/contexts/Catalog',
                '@id' => '/catalogs',
                '@type' => 'hydra:Collection',
                'hydra:totalItems' => 2,
            ]
        );
    }

    public function getDataProvider(): array
    {
        return [
            [1, ['id' => 1, 'code' => 'b2c_test', 'name' => 'B2C Test Catalog'], 200],
            [5, ['id' => 5, 'code' => 'missing_name'], 200],
            [10, [], 404],
        ];
    }

    protected function getJsonGetValidation(array $expectedData): array
    {
        $data = ['code' => $expectedData['code']];
        if (isset($expectedData['name'])) {
            $data['name'] = $expectedData['name'];
        }

        return $data;
    }

    public function deleteDataProvider(): array
    {
        return [
            [1, 200],
            [5, 200],
            [10, 404],
        ];
    }

    protected function getJsonGetCollectionValidation(): array
    {
        return ['hydra:totalItems' => 20];
    }
}
