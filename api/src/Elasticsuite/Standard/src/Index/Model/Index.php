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
use Elasticsuite\Index\MutationResolver\CreateIndexMutation;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: ['get', 'post'],
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
        ],
        itemOperations: ['get', 'delete'],
        paginationEnabled: false,
    ),
]
class Index
{
    #[ApiProperty(
        identifier: true
    )]
    private string $name;

    private string $alias;

    public function __construct(
        string $name,
        string $alias = ''
    ) {
        $this->name = $name;
        $this->alias = $alias;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getAlias(): string
    {
        return $this->alias;
    }

    public function setAlias(string $alias): void
    {
        $this->alias = $alias;
    }
}
