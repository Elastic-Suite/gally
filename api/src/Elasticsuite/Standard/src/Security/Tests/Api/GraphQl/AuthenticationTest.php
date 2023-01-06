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

namespace Elasticsuite\Security\Tests\Api\GraphQl;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Elasticsuite\User\Tests\LoginTrait;

class AuthenticationTest extends ApiTestCase
{
    use LoginTrait;

    public function testLogin(): void
    {
        $client = self::createClient();
        $listQuery = [
            'operationName' => null,
            'variables' => [],
            'query' => <<<GQL
                { catalogs { edges { node { id } } } }
            GQL,
        ];
        $createQuery = [
            'operationName' => null,
            'variables' => [],
            'query' => <<<GQL
                mutation { createCatalog (input: { code: "test", name: "Test" }) { catalog { id } } }
            GQL,
        ];

        // Test before login
        $client->request('POST', '/graphql', ['json' => $listQuery]);
        $this->assertJsonContains(['data' => []]);
        $response = $client->request('POST', '/graphql', ['json' => $createQuery]);
        $this->assertEquals('Access Denied.', $response->toArray()['errors'][0]['message']);

        // Log contributor
        $token = $this->loginGraphQl($client, $this->getUser(Role::ROLE_CONTRIBUTOR));
        $this->assertResponseIsSuccessful();
        $this->assertNotEmpty($token);

        // Test not authorized.
        $client->request('POST', '/graphql', ['json' => $listQuery]);
        $this->assertJsonContains(['data' => []]);
        $client->request('POST', '/graphql', ['auth_bearer' => $token, 'json' => $createQuery]);
        $this->assertEquals('Access Denied.', $response->toArray()['errors'][0]['message']);

        // Log admin
        $token = $this->loginGraphQl($client, $this->getUser(Role::ROLE_ADMIN));
        $this->assertResponseIsSuccessful();
        $this->assertNotEmpty($token);

        // Test authorized.
        $client->request('POST', '/graphql', ['json' => $listQuery]);
        $this->assertJsonContains(['data' => []]);
        $client->request('POST', '/graphql', ['auth_bearer' => $token, 'json' => $createQuery]);
        $this->assertJsonContains(['data' => []]);

        $this->logout();
    }

    public function testLoginInvalidCredentials(): void
    {
        $client = self::createClient();
        $user = new User();
        $user->setEmail('fake@test.com', )
            ->setPassword('fakepassword');
        $this->loginGraphQl($client, $user);

        $this->assertJsonContains([
            'data' => [
                'tokenAuthentication' => [
                    'authentication' => [
                        'code' => 401,
                        'message' => 'Invalid credentials.',
                    ],
                ],
            ],
        ]);
    }
}
