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

namespace Elasticsuite\Example\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: ['get', 'post'],
        graphql: [
            'item_query',
            'collection_query',
            'create' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        itemOperations: ['get', 'delete'],
        paginationEnabled: false,
    ),
]
class ExampleIndex
{
    #[ApiProperty(
        identifier: true
    )]
    private string $name;

    #[ApiProperty(
        description: 'health'
    )]
    private string $health;

    public function __construct(
        string $name,
        string $health = ''
    ) {
        $this->name = $name;
        $this->health = $health;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getHealth(): string
    {
        return $this->health;
    }
}
