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
use Symfony\Contracts\HttpClient\ResponseInterface;

abstract class AbstractTest extends ApiTestCase
{
    use LoginTrait;

    protected static function loadFixture(array $paths)
    {
        $databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $databaseTool->loadAliceFixture($paths);
    }

    protected static function loadElasticsearchIndexFixtures(array $paths)
    {
        $elasticFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
        $elasticFixtures->loadFixturesIndexFiles($paths);
    }

    protected static function loadElasticsearchDocumentFixtures(array $paths)
    {
        $elasticFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
        $elasticFixtures->loadFixturesDocumentFiles($paths);
    }

    protected static function deleteElasticsearchFixtures()
    {
        $elasticFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
        $elasticFixtures->deleteTestFixtures();
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

        return $this->request($method, $path, $data);
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
