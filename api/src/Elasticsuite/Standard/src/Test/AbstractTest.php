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

namespace Elasticsuite\Standard\src\Test;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;
use Elasticsuite\User\DataFixtures\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Contracts\HttpClient\ResponseInterface;

abstract class AbstractTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;
    private ElasticsearchFixtures $elasticFixtures;

    protected function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $this->elasticFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
    }

    protected function loadFixture(array $paths)
    {
        $this->databaseTool->loadAliceFixture($paths);
    }

    protected function loadElasticsearchIndexFixtures(array $paths)
    {
        $this->elasticFixtures->loadFixturesIndexFiles($paths);
    }

    protected function loadElasticsearchDocumentFixtures(array $paths)
    {
        $this->elasticFixtures->loadFixturesDocumentFiles($paths);
    }

    protected function deleteElasticsearchFixtures()
    {
        $this->elasticFixtures->deleteTestFixtures();
    }

    protected function requestGraphQl(string $query, array $headers = []): ResponseInterface
    {
        $response = $this->request(
            'POST',
            '/graphql',
            [
                'json' => [
                    'operationName' => null,
                    'query' => $query,
                    'variables' => [],
                ],
                'headers' => $headers,
            ]
        );
        $this->assertResponseHeaderSame('content-type', 'application/json');
        $this->assertResponseStatusCodeSame(200);

        return $response;
    }

    protected function requestRest(string $method, string $path, array $json = [], $headers = []): ResponseInterface
    {
        $data = ['headers' => $headers];
        if (\in_array($method, ['POST', 'PUT'], true)) {
            $data['json'] = $json;
        }

        $response = $this->request($method, $path, $data);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        return $response;
    }

    private function request(string $method, string $path, array $data = []): ResponseInterface
    {
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(), // @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $data['auth_bearer'] = $loginJson['token'];

        return $client->request($method, $path, $data);
    }
}
