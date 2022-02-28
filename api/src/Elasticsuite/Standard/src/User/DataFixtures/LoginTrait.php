<?php

declare(strict_types=1);

namespace Elasticsuite\User\DataFixtures;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\Client;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\User\Constant\UserTest;
use Elasticsuite\User\Model\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Trait LoginTrait
 *
 * @package Elasticsuite\User\DataFixtures
 */
trait LoginTrait
{
   public function login(Client $client, EntityManagerInterface $manager, UserPasswordHasherInterface $passwordHasher): array
   {
       $user = $manager->getRepository(User::class)->findOneBy(['email' => UserTest::EMAIL]);
       if ($user === null) {
           $user = new User();
           $user->setEmail(UserTest::EMAIL);
           $user->setPassword(
               $passwordHasher->hashPassword($user, UserTest::PASSWORD)
           );

           $manager->persist($user);
           $manager->flush();
       }

       $response = $client->request('POST', '/authentication_token', [
           'headers' => ['Content-Type' => 'application/json'],
           'json' => [
               'email' => UserTest::EMAIL,
               'password' => UserTest::PASSWORD,
           ],
       ]);

       return $response->toArray();
   }
}
