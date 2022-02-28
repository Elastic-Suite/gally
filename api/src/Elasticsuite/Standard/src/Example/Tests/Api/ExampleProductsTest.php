<?php

namespace Elasticsuite\Example\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;
use Elasticsuite\User\DataFixtures\LoginTrait;

/**
 * Documentation: https://api-platform.com/docs/distribution/testing/
 */
class ExampleProductsTest extends ApiTestCase
{
    use LoginTrait;

    private ?ElasticsearchFixtures $elasticsearchFixtures;

    public function setUp(): void
    {
        $this->elasticsearchFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
        $this->elasticsearchFixtures->deleteTestFixtures();
        $this->elasticsearchFixtures->loadFixturesIndexFiles([__DIR__ . '/../../DataFixtures/fixtures/index_example.json']);
        $this->elasticsearchFixtures->loadFixturesDocumentFiles([__DIR__ . '/../../DataFixtures/fixtures/products_example.json']);
    }

    public function testGetCollection(): void
    {
        $client = static::createClient();
        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),
            static::getContainer()->get('security.user_password_hasher')
        );

        $response = $client->request('GET', '/example_products', ['auth_bearer' => $loginJson['token']]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/ExampleProduct',
            '@id' => '/example_products',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);
    }

    public function tearDown(): void
    {
        $this->elasticsearchFixtures->deleteTestFixtures();
    }
}
