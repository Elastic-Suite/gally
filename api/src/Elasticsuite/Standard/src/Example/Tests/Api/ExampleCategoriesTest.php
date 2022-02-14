<?php

namespace Elasticsuite\Example\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

/**
 * Documentation: https://api-platform.com/docs/distribution/testing/
 */
class ExampleCategoriesTest extends ApiTestCase
{

    private AbstractDatabaseTool $databaseTool;

    public function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testGetCollection(): void
    {
        $this->databaseTool->loadAliceFixture([__DIR__ . '/../fixtures/categories_example.yaml']);

        $response = static::createClient()->request('GET', '/example_categories');

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
