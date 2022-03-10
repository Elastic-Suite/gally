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

namespace Elasticsuite\Index\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\User\DataFixtures\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;
use Symfony\Contracts\HttpClient\ResponseInterface;

abstract class AbstractTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;

    protected function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    protected function loadFixture(array $paths)
    {
        $this->databaseTool->loadAliceFixture($paths);
    }

    protected function request(string $method, string $path, array $json = []): ResponseInterface
    {
        $client = static::createClient();

        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(), // @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $data = ['auth_bearer' => $loginJson['token']];
        if ('POST' === $method) {
            $data['json'] = $json;
        }

        $response = $client->request($method, $path, $data);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        return $response;
    }
}
