<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: [
            'get',
            'post' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        graphql: [
            'item_query',
            'collection_query',
            'create' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        itemOperations: [
            'get',
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
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
