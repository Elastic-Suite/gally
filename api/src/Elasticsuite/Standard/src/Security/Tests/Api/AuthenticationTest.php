<?php

namespace Elasticsuite\Security\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\User\DataFixtures\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

class AuthenticationTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;

    public function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testLogin(): void
    {
        $client = self::createClient();
        $loginJson = $this->login(
            $client,
            static::getContainer()->get('doctrine')->getManager(),
            static::getContainer()->get('security.user_password_hasher')
        );

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $loginJson);

        // test not authorized
        $client->request('GET', '/indices');
        $this->assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/indices', ['auth_bearer' => $loginJson['token']]);
        $this->assertResponseIsSuccessful();
    }
}
