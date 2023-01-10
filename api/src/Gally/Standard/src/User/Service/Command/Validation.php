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

namespace Gally\User\Service\Command;

use Gally\User\Service\UserManager;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class Validation
{
    public function __construct(
        private UserManager $userManager,
        private ValidatorInterface $validator
    ) {
    }

    public function notBlank(mixed $value): array
    {
        $errors = [];
        $notBlank = new NotBlank();
        if (\count($this->validator->validate($value, $notBlank)) > 0) {
            $errors[] = 'This field cannot be empty.';
        }

        return $errors;
    }

    public function email(?string $value): array
    {
        $errors = [];
        if (\count($this->validator->validate($value, new Email())) > 0) {
            $errors[] = 'The email is invalid.';
        }

        return $errors;
    }

    public function userExists(?string $email): array
    {
        $errors = [];
        if (!$this->userManager->isUserExists($email)) {
            $errors[] = 'This user does not exist.';
        }

        return $errors;
    }

    public function userNotExists(?string $email): array
    {
        $errors = [];
        if ($this->userManager->isUserExists($email)) {
            $errors[] = 'This user already exists.';
        }

        return $errors;
    }

    public function rolesExist(?array $roles): array
    {
        $errors = [];
        $fakeRoles = $this->userManager->getFakeRoles($roles);
        if (\count($fakeRoles) > 0) {
            if (1 === \count($fakeRoles)) {
                $errors[] = 'The role "' . reset($fakeRoles) . '" does not exist.';
            } else {
                $errors[] = 'The roles "' . implode(', ', $fakeRoles) . '" do not exist.';
            }
        }

        return $errors;
    }
}
