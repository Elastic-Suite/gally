<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Standard\src\User\Tests\Unit\Service\Command;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Service\Command\Validation;

class ValidationTest extends AbstractTest
{
    private static Validation $cmdValidation;
    private static string $userEmail = 'admin@test.com';
    private static string $fakeUserEmail = 'fake_admin@test.com';

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$cmdValidation = static::getContainer()->get(Validation::class);
    }

    public function testNotBlank(): void
    {
        $this->assertEquals([], self::$cmdValidation->notBlank(self::$userEmail));
    }

    public function testErrorNotBlank(): void
    {
        $this->assertEquals(['This field cannot be empty.'], self::$cmdValidation->notBlank(''));
        $this->assertEquals(['This field cannot be empty.'], self::$cmdValidation->notBlank(null));
    }

    public function testEmail(): void
    {
        $this->assertEquals([], self::$cmdValidation->email(self::$userEmail));
    }

    public function testErrorEmail(): void
    {
        $this->assertEquals(['The email is invalid.'], self::$cmdValidation->email('wrongemail'));
    }

    public function testUserExists(): void
    {
        $this->assertEquals([], self::$cmdValidation->userExists(self::$userEmail));
    }

    public function testErrorUserExists(): void
    {
        $this->assertEquals(['This user does not exist.'], self::$cmdValidation->userExists(self::$fakeUserEmail));
    }

    public function testUserNotExists(): void
    {
        $this->assertEquals([], self::$cmdValidation->userNotExists(self::$fakeUserEmail));
    }

    public function testErrorUserNotExists(): void
    {
        $this->assertEquals(['This user already exists.'], self::$cmdValidation->userNotExists(self::$userEmail));
    }

    public function testRolesExist(): void
    {
        $this->assertEquals([], self::$cmdValidation->rolesExist(Role::ROLES));
    }

    public function testErrorRolesExist(): void
    {
        $this->assertEquals(['The role "ROLE_FAKE_1" does not exist.'], self::$cmdValidation->rolesExist(['ROLE_FAKE_1', Role::ROLE_CONTRIBUTOR]));
        $this->assertEquals(['The roles "ROLE_FAKE_1, ROLE_FAKE_2" do not exist.'], self::$cmdValidation->rolesExist(['ROLE_FAKE_1', 'ROLE_FAKE_2', Role::ROLE_ADMIN]));
    }
}
