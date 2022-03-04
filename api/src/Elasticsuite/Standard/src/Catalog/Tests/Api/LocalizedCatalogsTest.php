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

namespace Elasticsuite\Catalog\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\User\DataFixtures\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class LocalizedCatalogsTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;

    protected function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    /**
     * @dataProvider validCatalogProvider
     *
     * @param mixed $validCatalog
     */
    public function testCreateValidCatalog($validCatalog): void
    {
        $validCatalog['catalog'] = $this->createValidCatalogAndGetId();

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $response = $client->request('POST', '/localized_catalogs', ['auth_bearer' => $loginJson['token'], 'json' => $validCatalog]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/LocalizedCatalog',
                '@type' => 'LocalizedCatalog',
                'code' => $validCatalog['code'],
                'locale' => $validCatalog['locale'],
            ]
        );

        if (isset($validCatalog['name'])) {
            $this->assertJsonContains(
                [
                    'name' => $validCatalog['name'] ?? '',
                ]
            );
        }

        $this->assertMatchesRegularExpression('~^/localized_catalogs/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(LocalizedCatalog::class);
    }

    public function validCatalogProvider(): array
    {
        return [
            [['code' => 'valid_code', 'name' => 'B2C French catalog', 'locale' => 'fr_FR']],
            [['code' => 'empty_name', 'name' => '', 'locale' => 'en_US']],
            [['code' => 'missing_name', 'locale' => 'fr_FR']],
        ];
    }

    public function testCreateValidLocalizedCatalogWithoutCatalog(): void
    {
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('POST', '/localized_catalogs',
            [
                'auth_bearer' => $loginJson['token'],
                'json' => ['code' => 'no_catalog', 'name' => 'B2C French catalog', 'locale' => 'fr_FR'],
            ]
        );

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'catalog: This value should not be blank.',
            ]
        );
    }

    /**
     * @dataProvider invalidCodeCatalogProvider
     *
     * @param mixed $invalidCatalog
     */
    public function testCreateInvalidCodeCatalog($invalidCatalog): void
    {
        $invalidCatalog['catalog'] = $this->createValidCatalogAndGetId();

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('POST', '/localized_catalogs', ['auth_bearer' => $loginJson['token'], 'json' => $invalidCatalog]);

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

    public function invalidCodeCatalogProvider(): array
    {
        return [
            [['code' => '', 'locale' => 'en_US', 'name' => 'Empty Code']],
            [['code' => '', 'locale' => 'en_US']],
            [['locale' => 'en_US', 'name' => 'Missing Code']],
        ];
    }

    /**
     * @dataProvider missingLocaleCatalogProvider
     *
     * @param mixed $invalidCatalog
     */
    public function testCreateMissingLocaleCatalog($invalidCatalog): void
    {
        $invalidCatalog['catalog'] = $this->createValidCatalogAndGetId();

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('POST', '/localized_catalogs', ['auth_bearer' => $loginJson['token'], 'json' => $invalidCatalog]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'locale: This value should not be blank.',
            ]
        );
    }

    public function missingLocaleCatalogProvider(): array
    {
        return [
            [['code' => 'missing_locale']],
        ];
    }

    /**
     * @dataProvider invalidCatalogLocaleProvider
     *
     * @param mixed $invalidCatalog
     */
    public function testCreateInvalidCatalogLocale($invalidCatalog): void
    {
        $invalidCatalog['catalog'] = $this->createValidCatalogAndGetId();

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('POST', '/localized_catalogs', ['auth_bearer' => $loginJson['token'], 'json' => $invalidCatalog]);

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

    public function invalidCatalogLocaleProvider(): array
    {
        return [
            [['code' => 'cat_1_invalid', 'locale' => 'strin']],
            [['code' => 'cat_1_invalid', 'locale' => 'fr-fr']],
        ];
    }

    /**
     * @dataProvider invalidCatalogLocaleLengthProvider
     *
     * @param mixed $invalidCatalog
     */
    public function testCreateInvalidCatalogLocaleLength($invalidCatalog): void
    {
        $invalidCatalog['catalog'] = $this->createValidCatalogAndGetId();

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('POST', '/localized_catalogs', ['auth_bearer' => $loginJson['token'], 'json' => $invalidCatalog]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/ConstraintViolationList',
                '@type' => 'ConstraintViolationList',
                'hydra:title' => 'An error occurred',
                'hydra:description' => 'locale: This value is not valid.
locale: This value should have exactly 5 characters.',
            ]
        );
    }

    public function invalidCatalogLocaleLengthProvider(): array
    {
        return [
            [['code' => 'cat_1_invalid', 'locale' => 'too_long_locale']],
            [['code' => 'cat_1_invalid', 'locale' => 'a']],
            [['code' => 'cat_1_invalid', 'locale' => 'abc']],
        ];
    }

    /**
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function testGetCollection(): void
    {
        $this->databaseTool->loadAliceFixture([__DIR__ . '/../fixtures/localized_catalogs.yaml']);

        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $client->request('GET', '/localized_catalogs', ['auth_bearer' => $loginJson['token']]);

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains(
            [
                '@context' => '/contexts/LocalizedCatalog',
                '@id' => '/localized_catalogs',
                '@type' => 'hydra:Collection',
                'hydra:totalItems' => 3,
            ]
        );
    }

    private function createValidCatalogAndGetId(): string
    {
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),// @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $catalogCreation = $client->request('POST', '/catalogs', [
            'auth_bearer' => $loginJson['token'],
            'json' => ['code' => uniqid('test_catalog')], ]
        );

        return $catalogCreation->toArray()['@id'];
    }
}
