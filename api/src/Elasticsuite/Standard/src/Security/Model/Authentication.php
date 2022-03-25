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

namespace Elasticsuite\Security\Model;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Security\Resolver\AuthenticationMutationResolver;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'token' => [
                'mutation' => AuthenticationMutationResolver::class,
                'validate' => false,
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'args' => [
                    'email' => ['type' => 'String!', 'description' => 'Email of the user'],
                    'password' => ['type' => 'String!', 'description' => 'Password of the user'],
                ],
            ],
        ],
        itemOperations: [
            'get' => [
                'controller' => NotFoundAction::class,
                'read' => false,
                'output' => false,
            ],
        ],
    ),
]
class Authentication
{
    /**
     * The id is not stored anywhere, it has been created because it is mandatory for ApiResources.
     * E-mail cannot be used as the identifier because of the dots in an e-mail.
     */
    #[ApiProperty(
        identifier: true
    )]
    private string $id;

    private string $email;

    private string $password;

    private string $token = '';

    private int $code;

    private string $message = '';

    public function __construct()
    {
        $this->setId(uniqid());
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function setToken(string $token): void
    {
        $this->token = $token;
    }

    public function getCode(): int
    {
        return $this->code;
    }

    public function setCode(int $code): void
    {
        $this->code = $code;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public function setMessage(string $message): void
    {
        $this->message = $message;
    }
}
