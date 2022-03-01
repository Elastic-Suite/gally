<?php

namespace Elasticsuite\Catalog\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Catalog\Model\Catalog;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class CatalogsTest extends ApiTestCase
{
    private AbstractDatabaseTool $databaseTool;

    public function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    /**
     * @dataProvider validCatalogProvider
     */
    public function testCreateValidCatalog($validCatalog): void
    {
        $response = static::createClient()->request('POST', '/catalogs', ['json' => $validCatalog]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/Catalog',
                '@type' => 'Catalog',
                'code' => $validCatalog['code']
            ]
        );

        if (isset($validCatalog['name'])) {
            $this->assertJsonContains(
                [
                    'name' => $validCatalog['name'] ?? '',
                ]
            );
        }

        $this->assertMatchesRegularExpression('~^/catalogs/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Catalog::class);
    }

    public function validCatalogProvider()
    {
        return [
            [['code' => 'valid_code', 'name' => 'B2C Catalog']],
            [['code' => 'empty_name', 'name' => '']],
            [['code' => 'missing_name']]
        ];
    }

    /**
     * @dataProvider invalidCatalogProvider
     */
    public function testCreateInvalidCatalog($invalidCatalog): void
    {
        static::createClient()->request('POST', '/catalogs', ['json' => $invalidCatalog]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'code: This value should not be blank.',
            ]
        );
    }

    public function invalidCatalogProvider()
    {
        return [
            [['code' => '', 'name' => 'Empty Code']],
            [['code' => '']],
            [['name' => 'Missing Code']]
        ];
    }

    /**
     * @return void
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function testGetCollection(): void
    {
        $this->databaseTool->loadAliceFixture([__DIR__ . '/../fixtures/catalogs.yaml']);

        static::createClient()->request('GET', '/catalogs');

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
}
