<?php

namespace Elasticsuite\Catalog\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Catalog\Model\Catalog;
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
        $validCatalog['website'] = $this->createValidWebsiteAndGetId();

        $response = static::createClient()->request('POST', '/catalogs', ['json' => $validCatalog]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/Catalog',
                '@type' => 'Catalog',
                'code' => $validCatalog['code'],
                'locale' => $validCatalog['locale'],
            ]
        );

        if (isset($validWebsite['name'])) {
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
            [['code' => 'valid_code', 'name' => 'B2C French catalog', 'locale' => 'fr_FR']],
            [['code' => 'empty_name', 'name' => '', 'locale' => 'en_US']],
            [['code' => 'missing_name', 'locale' => 'fr_FR']]
        ];
    }

    public function testCreateValidCatalogWithoutWebsite(): void
    {
        static::createClient()->request(
            'POST',
            '/catalogs',
            ['json' =>
                 ['code' => 'valid_code', 'name' => 'B2C French catalog', 'locale' => 'fr_FR']
            ]
        );

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'website: This value should not be blank.',
            ]
        );
    }

    /**
     * @dataProvider invalidCatalogProvider
     */
    public function testCreateInvalidCatalog($invalidCatalog): void
    {
        $invalidCatalog['website'] = $this->createValidWebsiteAndGetId();

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
     * @dataProvider invalidCatalogLocaleProvider
     */
    public function testCreateInvalidCatalogLocale($invalidCatalog): void
    {
        $invalidCatalog['website'] = $this->createValidWebsiteAndGetId();

        static::createClient()->request('POST', '/catalogs', ['json' => $invalidCatalog]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'locale: This value is not valid.',
            ]
        );
    }

    public function invalidCatalogLocaleProvider()
    {
        return [
            [['code' => 'cat_1_invalid', 'locale' => 'strin']],
            [['code' => 'cat_1_invalid', 'locale' => 'fr-fr']],
        ];
    }

    /**
     * @dataProvider invalidCatalogLocaleLengthProvider
     */
    public function testCreateInvalidCatalogLocaleLength($invalidCatalog): void
    {
        $websiteCreation = static::createClient()->request('POST', '/websites', ['json' => ['code' => uniqid('test_website')]]);
        $websiteId       = $websiteCreation->toArray()['@id'];
        $invalidCatalog['website'] = $websiteId;

        static::createClient()->request('POST', '/catalogs', ['json' => $invalidCatalog]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'locale: This value is not valid.
locale: This value should have exactly 5 characters.'
            ]
        );
    }

    public function invalidCatalogLocaleLengthProvider()
    {
        return [
            [['code' => 'cat_1_invalid', 'locale' => 'too_long_locale']],
            [['code' => 'cat_1_invalid', 'locale' => 'a']],
            [['code' => 'cat_1_invalid', 'locale' => 'abc']],
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
                'hydra:totalItems' => 3,
            ]
        );
    }

    private function createValidWebsiteAndGetId()
    {
        $websiteCreation = static::createClient()->request('POST', '/websites', ['json' => ['code' => uniqid('test_website')]]);

        return $websiteCreation->toArray()['@id'];
    }
}
