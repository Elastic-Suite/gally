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
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Dto\CreateIndexInput;
use Elasticsuite\Index\Dto\InstallIndexInput;
use Elasticsuite\Index\Dto\RefreshIndexInput;
use Elasticsuite\Index\MutationResolver\BulkDeleteIndexMutation;
use Elasticsuite\Index\MutationResolver\BulkIndexMutation;
use Elasticsuite\Index\MutationResolver\CreateIndexMutation;
use Elasticsuite\Index\MutationResolver\InstallIndexMutation;
use Elasticsuite\Index\MutationResolver\RefreshIndexMutation;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\Serializer\Annotation\Groups;

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
                'normalization_context' => ['groups' => ['create']],
                'denormalization_context' => ['groups' => ['create']],
            ],
        ],
        graphql: [
            // Auto-generated queries and mutations.
            'item_query' => [
                'normalization_context' => ['groups' => ['details']],
                'denormalization_context' => ['groups' => ['details']],
            ],
            'collection_query',
            'create' => [
                'mutation' => CreateIndexMutation::class,
                'args' => [
                    'entityType' => ['type' => 'String!', 'description' => 'Entity type for which to create an index'],
                    'localizedCatalog' => ['type' => 'String!', 'description' => 'Catalog scope for which to create an index'],
                ],
                'read' => false,
                'deserialize' => false,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
                'normalization_context' => ['groups' => ['details']],
                'denormalization_context' => ['groups' => ['details']],
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
            'get' => [
                'normalization_context' => ['groups' => ['details']],
                'denormalization_context' => ['groups' => ['details']],
            ],
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
        normalizationContext: ['groups' => ['list']],
        denormalizationContext: ['groups' => ['list']],
        paginationEnabled: false,
    ),
]
class Index
{
    public const STATUS_LIVE = 'live';
    public const STATUS_EXTERNAL = 'external';
    public const STATUS_GHOST = 'ghost';
    public const STATUS_INVALID = 'invalid';
    public const STATUS_INDEXING = 'indexing';

    #[ApiProperty(
        identifier: true
    )]
    #[Groups(['list', 'details', 'create'])]
    private string $name;

    /** @var string[] */
    #[Groups(['list', 'details', 'create'])]
    private array $aliases;

    #[Groups(['list', 'details'])]
    private int $docsCount;

    #[Groups(['list', 'details'])]
    private string $size;

    #[Groups(['list', 'details'])]
    private ?string $entityType;

    #[Groups(['list', 'details'])]
    private ?LocalizedCatalog $localizedCatalog;

    #[Groups(['list', 'details'])]
    private string $status;

    #[Groups(['details'])]
    private array $mapping;

    #[Groups(['details'])]
    private array $settings;

    /**
     * @param string   $name      Index name
     * @param string[] $aliases   Index aliases
     * @param int      $docsCount Index documents count
     * @param string   $size      Index size
     */
    public function __construct(
        string $name,
        array $aliases = [],
        int $docsCount = 0,
        string $size = '',
    ) {
        $this->name = $name;
        $this->aliases = $aliases;
        $this->docsCount = $docsCount;
        $this->size = $size;
        $this->entityType = null;
        $this->localizedCatalog = null;
        $this->status = self::STATUS_EXTERNAL;
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

    public function getDocsCount(): int
    {
        return $this->docsCount;
    }

    public function getSize(): string
    {
        return $this->size;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getLocalizedCatalog(): ?LocalizedCatalog
    {
        return $this->localizedCatalog;
    }

    public function setLocalizedCatalog(?LocalizedCatalog $localizedCatalog): void
    {
        $this->localizedCatalog = $localizedCatalog;
    }

    public function getEntityType(): ?string
    {
        return $this->entityType;
    }

    public function setEntityType(?string $entityType): void
    {
        $this->entityType = $entityType;
    }

    public function getMapping(): array
    {
        return $this->mapping;
    }

    public function setMapping(array $mapping): void
    {
        $this->mapping = $mapping;
    }

    public function getSettings(): array
    {
        return $this->settings;
    }

    public function setSettings(array $settings): void
    {
        $this->settings = $settings;
    }
}
