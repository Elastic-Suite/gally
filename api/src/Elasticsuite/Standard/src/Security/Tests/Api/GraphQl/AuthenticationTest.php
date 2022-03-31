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
use Elasticsuite\User\DataFixtures\LoginTrait;

class AuthenticationTest extends ApiTestCase
{
    use LoginTrait;

    public function testLogin(): void
    {
        $client = self::createClient();
        $loginJson = $this->loginGraphQl(
            $client,
            static::getContainer()->get('doctrine')->getManager(), // @phpstan-ignore-line
            static::getContainer()->get('security.user_password_hasher')
        );

        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $loginJson);

        $catalog = ['code' => 'login_graphql_catalog', 'name' => 'Login GraphQL catalog'];
        $query = <<<GQL
            mutation {
              createCatalog(input: { code:"{$catalog['code']}", name: "{$catalog['name']}"}) {
                catalog {
                  code
                  name
                }
              }
            }
        GQL;

        // Test not authorized.
        $response = $client->request(
            'POST',
            '/graphql',
            [
                'json' => [
                    'operationName' => null,
                    'query' => $query,
                    'variables' => [],
                ],
            ]
        );
        $this->assertStringContainsString('"debugMessage":"Access Denied."', $response->getContent());

        // Test authorized.
        $client->request(
            'POST',
            '/graphql',
            [
                'json' => [
                    'operationName' => null,
                    'query' => $query,
                    'variables' => [],
                ],
                'auth_bearer' => $loginJson['token'],
            ]
        );

        $this->assertJsonContains([
            'data' => [
                'createCatalog' => [
                    'catalog' => [
                        'code' => $catalog['code'],
                        'name' => $catalog['name'],
                    ],
                ],
            ],
        ]);
    }

    public function testLoginInvalidCredentials(): void
    {
        $query = <<<GQL
            mutation {
              tokenAuthentication(input: {email: "fake_user@test.com", password: "fake_password"}) {
                authentication {
                  code
                  message
                }
              }
            }
        GQL;

        self::createClient()->request(
            'POST',
            '/graphql',
            [
                'json' => [
                    'operationName' => null,
                    'query' => $query,
                    'variables' => [],
                ],
            ]
        );

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
