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

namespace Elasticsuite\User\DataFixtures;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\User\Constant\UserTest;
use Elasticsuite\User\Model\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Trait LoginTrait.
 */
trait LoginTrait
{
    public function login(Client $client, EntityManagerInterface $manager, UserPasswordHasherInterface $passwordHasher): array
    {
        $this->initTestUser($manager, $passwordHasher);
        $response = $client->request('POST', '/authentication_token', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => UserTest::EMAIL,
                'password' => UserTest::PASSWORD,
            ],
        ]);

        return $response->toArray();
    }

    public function loginGraphQl(Client $client, EntityManagerInterface $manager, UserPasswordHasherInterface $passwordHasher): array
    {
        $this->initTestUser($manager, $passwordHasher);
        $email = UserTest::EMAIL;
        $password = UserTest::PASSWORD;

        $query = <<<GQL
            mutation {
              tokenAuthentication(input: {email: "{$email}", password: "{$password}"}) {
                authentication {
                  id
                  email
                  password
                  token
                  code
                  message
                }
              }
            }
        GQL;

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

        $responseArray = $response->toArray();

        return $responseArray['data']['tokenAuthentication']['authentication'] ?? $responseArray;
    }

    public function initTestUser(EntityManagerInterface $manager, UserPasswordHasherInterface $passwordHasher): void
    {
        $user = $manager->getRepository(User::class)->findOneBy(['email' => UserTest::EMAIL]);
        if (null === $user) {
            $user = new User();
            $user->setEmail(UserTest::EMAIL);
            $user->setPassword(
                $passwordHasher->hashPassword($user, UserTest::PASSWORD)
            );
            $user->setRoles(UserTest::ROLES);

            $manager->persist($user);
            $manager->flush();
        }
    }
}
