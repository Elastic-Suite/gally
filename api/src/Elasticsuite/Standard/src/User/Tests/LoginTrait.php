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

namespace Elasticsuite\User\Tests;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;

/**
 * Trait LoginTrait.
 */
trait LoginTrait
{
    private static array $tokens = [];

    public static function getUserFixtures(): array
    {
        return [__DIR__ . '/fixtures/test_user.yaml'];
    }

    public function getUser(string $role): User
    {
        $user = new User();
        $user->setRoles([$role])
            ->setEmail(match ($role) {
                Role::ROLE_ADMIN => 'admin@test.com',
                default => 'contributor@test.com',
            })
            ->setPassword('apassword');

        return $user;
    }

    public function loginRest(Client $client, User $user): string
    {
        $role = $user->getRoles()[0];
        if (!isset(self::$tokens[$role])) {
            $response = $client->request('POST', '/authentication_token', [
                'headers' => ['Content-Type' => 'application/json'],
                'json' => [
                    'email' => $user->getEmail(),
                    'password' => $user->getPassword(),
                ],
            ]);

            self::$tokens[$role] = $response->toArray()['token'];
        }

        return self::$tokens[$role];
    }

    public function loginGraphQl(Client $client, User $user): string
    {
        $role = $user->getRoles()[0];
        if (!isset(self::$tokens[$role])) {
            $response = $client->request(
                'POST',
                '/graphql',
                [
                    'json' => [
                        'operationName' => null,
                        'query' => <<<GQL
                            mutation {
                              tokenAuthentication(input: {email: "{$user->getEmail()}", password: "{$user->getPassword()}"}) {
                                authentication { token code message }
                              }
                            }
                        GQL,
                        'variables' => [],
                    ],
                ]
            );

            self::$tokens[$role] = $response->toArray()['data']['tokenAuthentication']['authentication']['token'];
        }

        return self::$tokens[$role];
    }

    public function logout(): void
    {
        self::$tokens = [];
    }
}
