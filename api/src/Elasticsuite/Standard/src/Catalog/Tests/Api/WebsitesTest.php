<?php

namespace Elasticsuite\Catalog\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Catalog\Model\Website;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class WebsitesTest extends ApiTestCase
{
    private AbstractDatabaseTool $databaseTool;

    public function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    /**
     * @dataProvider validWebsiteProvider
     */
    public function testCreateValidWebsite($validWebsite): void
    {
        $response = static::createClient()->request('POST', '/websites', ['json' => $validWebsite]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains(
            [
                '@context' => '/contexts/Website',
                '@type' => 'Website',
                'code' => $validWebsite['code']
            ]
        );

        if (isset($validWebsite['name'])) {
            $this->assertJsonContains(
                [
                    'name' => $validWebsite['name'] ?? '',
                ]
            );
        }

        $this->assertMatchesRegularExpression('~^/websites/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Website::class);
    }

    public function validWebsiteProvider()
    {
        return [
            [['code' => 'valid_code', 'name' => 'B2C Website']],
            [['code' => 'empty_name', 'name' => '']],
            [['code' => 'missing_name']]
        ];
    }

    /**
     * @dataProvider invalidWebsiteProvider
     */
    public function testCreateInvalidWebsite($invalidWebsite): void
    {
        static::createClient()->request('POST', '/websites', ['json' => $invalidWebsite]);

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

    public function invalidWebsiteProvider()
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
        $this->databaseTool->loadAliceFixture([__DIR__ . '/../fixtures/websites.yaml']);

        static::createClient()->request('GET', '/websites');

        $this->assertResponseIsSuccessful();

        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains(
            [
                '@context' => '/contexts/Website',
                '@id' => '/websites',
                '@type' => 'hydra:Collection',
                'hydra:totalItems' => 2,
            ]
        );
    }
}
