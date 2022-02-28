<?php

namespace Elasticsuite\Example\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\User\DataFixtures\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;


/**
 * Documentation: https://api-platform.com/docs/distribution/testing/
 */
class ExampleCategoriesTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;

    public function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testGetCollection(): void
    {
        $this->databaseTool->loadAliceFixture([__DIR__ . '/../fixtures/categories_example.yaml']);
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),
            static::getContainer()->get('security.user_password_hasher')
        );

        $response = $client->request('GET', '/example_categories', ['auth_bearer' => $loginJson['token']]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/ExampleCategory',
            '@id' => '/example_categories',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);
    }
}
