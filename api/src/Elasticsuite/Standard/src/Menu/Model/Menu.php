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

namespace Elasticsuite\Menu\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Menu\Controller\MenuController;
use Elasticsuite\Menu\Resolver\MenuResolver;

#[
    ApiResource(
        itemOperations: [
            'menu' => [
                'method' => 'GET',
                'path' => 'menu',
                'read' => false,
                'deserialize' => false,
                'controller' => MenuController::class,
            ],
        ],
        collectionOperations: [],
        paginationEnabled: false,
        graphql: [
            'get' => [
                'item_query' => MenuResolver::class,
                'read' => false,
                'deserialize' => false,
                'args' => [],
            ],
        ],
    )
]
class Menu
{
    #[ApiProperty(identifier: true)]
    private string $code = 'menu';

    private MenuItem $root;

    public function __construct(MenuItem $root)
    {
        $this->root = $root;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getHierarchy(): array
    {
        return $this->root->asArray()['children'] ?? [];
    }
}
