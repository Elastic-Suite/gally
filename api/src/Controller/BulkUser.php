<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\UserData;
use App\Repository\UserDataRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Gally\User\Entity\User;
use Gally\User\Repository\UserRepository;
use Gally\User\Service\Command\Validation as CmdValidation;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
final class BulkUser extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private UserDataRepository $userDataRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private CmdValidation $cmdValidation,
    ) {
    }

    public function __invoke(Request $request): array
    {
        $users = json_decode($request->getContent(), true);
        if (!\is_array($users)) {
            throw new \RuntimeException('Invalid content provided.');
        }

        return $this->processBulk($users);
    }

    /**
     * Create/update users.
     *
     * @return UserData[]
     */
    private function processBulk(array $bulkItems): array
    {
        // Execute a single SQL query to find users by email
        $emails = array_column($bulkItems, 'email');
        $matchedUsersWithData = new ArrayCollection($this->userDataRepository->findByEmails($emails));
        $matchedUsers = new ArrayCollection($this->userRepository->findBy(['email' => $emails]));
        $processed = [];

        // Process bulk items
        foreach ($bulkItems as $bulkItem) {
            $userData = $this->processBulkItem($bulkItem, $matchedUsersWithData, $matchedUsers);
            $this->entityManager->persist($userData);
            $processed[] = $userData;
        }

        // Persist the changes if at least one bulk item was processed
        if ($processed) {
            $this->entityManager->flush();
        }

        return $processed;
    }

    /**
     * Create/update a user.
     */
    private function processBulkItem(array $bulkItem, ArrayCollection $matchedUsersWithData, ArrayCollection $matchedUsers): UserData
    {
        // Validate the bulk item
        $this->validateBulkItem($bulkItem);

        // Check if the user data entity already exists
        $userData = $matchedUsersWithData
            ->findFirst(fn (int $key, UserData $item): bool => $item->getUser()->getEmail() === $bulkItem['email']);

        if ($userData === null) {
            $this->validateBulkItemForUserDataCreation($bulkItem);

            // Check if the user entity already exists
            $user = $matchedUsers
                ->findFirst(fn (int $key, User $item): bool => $item->getEmail() === $bulkItem['email']);

            if ($user === null) {
                $this->validateBulkItemForUserCreation($bulkItem);
                $user = new User();
                $user->setPassword($this->passwordHasher->hashPassword($user, uniqid()));
            }

            $userData = new UserData();
            $userData->setUser($user);
        }

        $userData
            ->setDepartment($bulkItem['department'] ?? $userData->getDepartment())
            ->setIsDirector($bulkItem['isDirector'] ?? $userData->getIsDirector())
            ->setIsPermanent($bulkItem['isPermanent'] ?? $userData->getIsPermanent())
            ->setGroups($bulkItem['groups'] ?? $userData->getGroups());

        $user = $userData->getUser();
        $user
            ->setEmail($bulkItem['email'] ?? $user->getEmail())
            ->setFirstName($bulkItem['firstName'] ?? $user->getFirstName())
            ->setLastName($bulkItem['lastName'] ?? $user->getLastName())
            ->setIsActive($bulkItem['isActive'] ?? $user->getIsActive())
            ->setRoles($bulkItem['roles'] ?? $user->getRoles());

        return $userData;
    }

    /**
     * Assert that the bulk item data is valid.
     */
    private function validateBulkItem(array $data): void
    {
        if (!\array_key_exists('email', $data)) {
            throw new \RuntimeException('The user email is required.');
        }

        $invalidFields = array_diff_key($data, $this->getValidUserFields() + $this->getValidUserDataFields());
        if ($invalidFields) {
            throw new \RuntimeException(\sprintf('Unexpected fields: "%s".', implode('", "', $invalidFields)));
        }

        if (\array_key_exists('roles', $data)) {
            $errors = $this->cmdValidation->rolesExist($data['roles']);
            if ($errors) {
                throw new \RuntimeException(implode(' ', $errors));
            }
        }
    }

    /**
     * Assert that the bulk item data is valid in the context of creating a new user entity.
     */
    private function validateBulkItemForUserCreation(array $data): void
    {
        foreach ($this->getValidUserFields() as $field => $required) {
            if ($required && !\array_key_exists($field, $data)) {
                throw new \RuntimeException(\sprintf('Field "%s" is required for creating a user.', $field));
            }
        }
    }

    /**
     * Assert that the bulk item data is valid in the context of creating a new user data entity.
     */
    private function validateBulkItemForUserDataCreation(array $data): void
    {
        foreach ($this->getValidUserDataFields() as $field => $required) {
            if ($required && !\array_key_exists($field, $data)) {
                throw new \RuntimeException(\sprintf('Field "%s" is required for creating a user.', $field));
            }
        }
    }

    /**
     * Get the expected fields for the user entity (value is true if the field is required in creation mode).
     *
     * @return array<string, bool>
     */
    private function getValidUserFields(): array
    {
        return [
            'email' => true,
            'firstName' => true,
            'lastName' => true,
            'roles' => false,
            'isActive' => false,
        ];
    }

    /**
     * Get the expected fields for the user data entity (value is true if the field is required in creation mode).
     *
     * @return array<string, bool>
     */
    private function getValidUserDataFields(): array
    {
        return [
            'department' => true,
            'isDirector' => true,
            'isPermanent' => true,
            'groups' => false,
        ];
    }
}
