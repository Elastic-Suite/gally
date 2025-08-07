<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Controller\BulkUser;
use App\Repository\UserDataRepository;
use Doctrine\ORM\Mapping as ORM;
use Gally\Metadata\Operation\Bulk;
use Gally\User\Constant\Role;
use Gally\User\Entity\User;

#[ApiResource(
    operations: [
        new Get(security: "is_granted('" . Role::ROLE_ADMIN . "')"),
        new GetCollection(security: "is_granted('" . Role::ROLE_ADMIN . "')"),
        new Bulk(
            security: "is_granted('" . Role::ROLE_ADMIN . "')",
            controller: BulkUser::class,
            uriTemplate: '/user_datas/bulk',
            read: false,
            deserialize: false,
            validate: false,
            write: false,
            serialize: true,
            status: 200,
            openapiContext: [
                'summary' => 'Add or create users in bulks.',
                'description' => 'Add or create users in bulks.',
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                            ],
                            'example' => [
                                [
                                    'email' => 'user@example.com',
                                    'firstName' => 'John',
                                    'lastName' => 'Doe',
                                    'roles' => ['ROLE_CONTRIBUTOR'],
                                    'isActive' => true,
                                    'department' => 'Sample Department',
                                    'isDirector' => true,
                                    'isPermanent' => true,
                                    'groups' => ['GroupA/GroupA1', 'GroupB/GroupB3'],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ),
    ],
)]
#[ORM\Entity(repositoryClass: UserDataRepository::class)]
#[ORM\Table(name: 'ifpen_user_data')]
class UserData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\ManyToOne(targetEntity: User::class, cascade: ['persist'], inversedBy: 'id')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private User $user;

    #[ORM\Column(type: 'string')]
    private string $department;

    #[ORM\Column(type: 'boolean')]
    private bool $isDirector = false;

    #[ORM\Column(type: 'boolean')]
    private bool $isPermanent = false;

    #[ORM\Column(type: 'json', nullable: true)]
    private array $groups = [];

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getDepartment(): string
    {
        return $this->department;
    }

    public function setDepartment(?string $department): self
    {
        $this->department = $department;

        return $this;
    }

    public function getIsDirector(): bool
    {
        return $this->isDirector;
    }

    public function setIsDirector(bool $isDirector): self
    {
        $this->isDirector = $isDirector;

        return $this;
    }

    public function getIsPermanent(): bool
    {
        return $this->isPermanent;
    }

    public function setIsPermanent(bool $isPermanent): self
    {
        $this->isPermanent = $isPermanent;

        return $this;
    }

    public function getGroups(): array
    {
        return $this->groups;
    }

    public function setGroups(array $groups): self
    {
        $this->groups = $groups;

        return $this;
    }
}
