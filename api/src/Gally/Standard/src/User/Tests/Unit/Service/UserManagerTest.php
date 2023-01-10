<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\User\Tests\Unit\Service;

use Doctrine\ORM\EntityNotFoundException;
use Gally\Test\AbstractTest;
use Gally\User\Constant\Role;
use Gally\User\Model\User;
use Gally\User\Repository\UserRepository;
use Gally\User\Service\UserManager;

class UserManagerTest extends AbstractTest
{
    private static UserManager $userManager;
    private static UserRepository $userRepository;
    private static string $userEmail = 'user@example.com';

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([]);
        self::$userManager = static::getContainer()->get(UserManager::class);
        self::$userRepository = static::getContainer()->get(UserRepository::class);
    }

    public function testCreate(): void
    {
        $roles = [Role::ROLE_CONTRIBUTOR];
        $password = 'Gally123!';
        self::$userManager->create(self::$userEmail, $roles, $password);
        $user = self::$userRepository->findOneBy(['email' => self::$userEmail]);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals(self::$userEmail, $user->getEmail());
        $this->assertEquals($roles, $user->getRoles());
    }

    /**
     * @depends testCreate
     */
    public function testisUserExists()
    {
        $this->assertTrue(self::$userManager->isUserExists(self::$userEmail));
        $this->assertFalse(self::$userManager->isUserExists('fake_' . self::$userEmail));
    }

    public function testGetRoles()
    {
        $this->assertEquals(Role::ROLES, self::$userManager->getRoles());
    }

    public function testGetFakeRoles()
    {
        $fakeRole = 'ROLE_FAKE';
        $this->assertEquals([$fakeRole], self::$userManager->getFakeRoles([$fakeRole, Role::ROLE_ADMIN, Role::ROLE_CONTRIBUTOR]));
    }

    /**
     * @depends testCreate
     */
    public function testFailureUpdate(): void
    {
        // User not exists.
        $this->expectException(EntityNotFoundException::class);
        $this->expectExceptionMessage(sprintf("The user with the email 'fake_%s' was not found", self::$userEmail));
        self::$userManager->update('fake_' . self::$userEmail, self::$userEmail, null, null);
    }

    /**
     * @depends testCreate
     */
    public function testUpdate(): void
    {
        $this->assertTrue(true);
        $roles = [Role::ROLE_CONTRIBUTOR];
        $password = 'Gally123!';
        $newEmail = 'updated_user@example.com';
        $newRoles = [Role::ROLE_ADMIN, Role::ROLE_CONTRIBUTOR];
        $newPassword = 'NewGally123!';

        $user = self::$userRepository->findOneBy(['email' => self::$userEmail]);
        $user = clone $user;
        $this->assertInstanceOf(User::class, $user);

        self::$userManager->update(self::$userEmail, null, null, $newPassword);

        // Change password.
        $userUpdated = self::$userRepository->findOneBy(['email' => self::$userEmail]);
        $this->assertInstanceOf(User::class, $userUpdated);
        $newPasswordHash = $userUpdated->getPassword();
        $this->assertEquals($user->getEmail(), $userUpdated->getEmail());
        $this->assertEquals($user->getRoles(), $userUpdated->getRoles());
        $this->assertNotEquals($user->getPassword(), $newPasswordHash);

        // Change roles.
        self::$userManager->update(self::$userEmail, null, $newRoles, null);
        $userUpdated = self::$userRepository->findOneBy(['email' => self::$userEmail]);
        $this->assertInstanceOf(User::class, $userUpdated);
        $this->assertEquals($user->getEmail(), $userUpdated->getEmail());
        $this->assertEquals($newRoles, $userUpdated->getRoles());
        $this->assertEquals($userUpdated->getPassword(), $newPasswordHash);

        // Change email.
        self::$userManager->update(self::$userEmail, $newEmail, null, null);
        $this->assertInstanceOf(User::class, $userUpdated);
        $this->assertEquals($newEmail, $userUpdated->getEmail());
        $this->assertEquals($newRoles, $userUpdated->getRoles());
        $this->assertEquals($userUpdated->getPassword(), $newPasswordHash);

        // Change all.
        self::$userManager->update($newEmail, self::$userEmail, $roles, $password);
        $this->assertInstanceOf(User::class, $userUpdated);
        $this->assertEquals(self::$userEmail, $userUpdated->getEmail());
        $this->assertEquals($roles, $userUpdated->getRoles());
        $this->assertNotEquals($userUpdated->getPassword(), $newPasswordHash);
    }
}
