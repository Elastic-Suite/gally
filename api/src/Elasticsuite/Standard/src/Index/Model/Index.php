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

namespace Elasticsuite\Index\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Index\Dto\CreateIndexInput;
use Elasticsuite\Index\Dto\InstallIndexInput;
use Elasticsuite\Index\Dto\RefreshIndexInput;
use Elasticsuite\Index\MutationResolver\BulkDeleteIndexMutation;
use Elasticsuite\Index\MutationResolver\BulkIndexMutation;
use Elasticsuite\Index\MutationResolver\CreateIndexMutation;
use Elasticsuite\Index\MutationResolver\InstallIndexMutation;
use Elasticsuite\Index\MutationResolver\RefreshIndexMutation;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: [
            'get',
            'post' => [
                'method' => 'POST',
                'input' => CreateIndexInput::class,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        graphql: [
            // Auto-generated queries and mutations.
            'item_query',
            'collection_query',
            'create' => [
                'mutation' => CreateIndexMutation::class,
                'args' => [
                    'entityType' => ['type' => 'String!', 'description' => 'Entity type for which to create an index'],
                    'catalog' => ['type' => 'ID!', 'description' => 'Catalog scope for which to create an index'],
                ],
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
            'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'bulk' => [
                'mutation' => BulkIndexMutation::class,
                'args' => [
                    'indexName' => ['type' => 'String!'],
                    'data' => ['type' => 'String!'],
                ],
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
            'bulkDelete' => [
                'mutation' => BulkDeleteIndexMutation::class,
                'args' => [
                    'indexName' => ['type' => 'String!'],
                    'ids' => ['type' => '[ID]!'],
                ],
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
            'install' => [
                'mutation' => InstallIndexMutation::class,
                'args' => [
                    'name' => ['type' => 'String!', 'description' => 'Full index name'],
                ],
                'read' => true,
                'deserialize' => true,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
            'refresh' => [
                'mutation' => RefreshIndexMutation::class,
                'args' => [
                    'name' => ['type' => 'String!', 'description' => 'Full index name'],
                ],
                'read' => true,
                'deserialize' => true,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        itemOperations: [
            'get',
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'install' => [
                'openapi_context' => [
                    'description' => 'Installs an Index resource',
                    'summary' => 'Installs an Index resource',
                ],
                'path' => '/indices/install/{name}',
                'method' => 'PUT',
                'input' => InstallIndexInput::class, // RefreshIndexInput::class,
                'deserialize' => true,
                'read' => true,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
            'refresh' => [
                'openapi_context' => [
                    'description' => 'Refreshes an Index resource',
                    'summary' => 'Refreshes an Index resource',
                ],
                'path' => '/indices/refresh/{name}',
                'method' => 'PUT',
                'input' => RefreshIndexInput::class,
                'deserialize' => true,
                'read' => true,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        paginationEnabled: false,
    ),
]
class Index
{
    #[ApiProperty(
        identifier: true
    )]
    private string $name;

    /** @var string[] */
    private array $aliases;

    /**
     * @param string   $name    Index name
     * @param string[] $aliases Index aliases
     */
    public function __construct(
        string $name,
        array $aliases = []
    ) {
        $this->name = $name;
        $this->aliases = $aliases;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    /**
     * @return string[]
     */
    public function getAliases(): array
    {
        return $this->aliases;
    }

    /**
     * @param string[] $aliases index aliases
     */
    public function setAliases(array $aliases): void
    {
        $this->aliases = $aliases;
    }
}
