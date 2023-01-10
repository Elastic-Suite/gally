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

namespace Gally\Category\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\Category\Controller\GetCategoryTree;
use Gally\Category\Resolver\CategoryTreeResolver;
use Gally\User\Constant\Role;

#[ApiResource(
    collectionOperations: [],
    itemOperations: [
        'get_tree' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'method' => 'GET',
            'path' => '/categoryTree',
            'controller' => GetCategoryTree::class,
            'read' => false,
            'openapi_context' => [
                'parameters' => [
                    [
                        'name' => 'catalogId',
                        'in' => 'query',
                        'type' => 'int',
                    ],
                    [
                        'name' => 'localizedCatalogId',
                        'in' => 'query',
                        'type' => 'int',
                    ],
                ],
            ],
        ],
    ],
    graphql: [
        'get' => [
            'item_query' => CategoryTreeResolver::class,
            'args' => [
                'catalogId' => ['type' => 'Int'],
                'localizedCatalogId' => ['type' => 'Int'],
            ],
        ],
    ],
    attributes: [
        'gally' => [
            // Allows to add cache tags related to these resources in the HTTP response.
            'cache_tag' => ['resource_classes' => [Category::class, Category\Configuration::class]],
        ],
    ],
    paginationEnabled: false,
)]
class CategoryTree
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        private ?int $catalogId,
        #[ApiProperty(identifier: true)]
        private ?int $localizedCatalogId,
        private array $categories,
    ) {
    }

    public function getCatalogId(): ?int
    {
        return $this->catalogId;
    }

    public function getLocalizedCatalogId(): ?int
    {
        return $this->localizedCatalogId;
    }

    public function getCategories(): array
    {
        return $this->categories;
    }
}
