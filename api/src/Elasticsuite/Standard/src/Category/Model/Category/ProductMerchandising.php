<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Category\Model\Category;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Controller\CategoryProductPositionGet;
use Elasticsuite\Category\Controller\CategoryProductPositionSave;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Resolver\PositionGetResolver;
use Elasticsuite\Category\Resolver\PositionSaveResolver;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    paginationEnabled: false,
    normalizationContext: ['groups' => ['category_product_merchandising:read']],
    denormalizationContext: ['groups' => ['category_product_merchandising:write']],
    collectionOperations: [
        'post_positions' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'method' => 'POST',
            'path' => '/category_product_merchandisings/savePositions/{categoryId}',
            'controller' => CategoryProductPositionSave::class,
            'read' => false,
            'deserialize' => false,
            'validate' => false,
            'write' => false,
            'serialize' => true,
            'status' => Response::HTTP_OK,
            'normalization_context' => ['groups' => 'category_product_merchandising_result:read'],
            'openapi_context' => [
                'summary' => 'Save product positions in a category.',
                'description' => 'Save product positions in a category.',
                'parameters' => [
                    [
                        'name' => 'categoryId',
                        'in' => 'path',
                        'type' => 'Category',
                        'required' => true,
                    ],
                ],
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'catalogId' => ['type' => 'string'],
                                    'localizedCatalogId' => ['type' => 'string'],
                                    'positions' => ['type' => 'string'],
                                ],
                            ],
                            'example' => [
                                'catalogId' => 'string',
                                'localizedCatalogId' => 'string',
                                'positions' => '[{"productId": 1, "position": 10}, {"productId": 2, "position": 20}]',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
    itemOperations: [
        'get' => [
            'controller' => NotFoundAction::class,
            'read' => false,
            'output' => false,
        ],
        'get_positions' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'method' => 'GET',
            'path' => '/category_product_merchandisings/getPositions/{categoryId}/{localizedCatalogId}',
            'controller' => CategoryProductPositionGet::class,
            'read' => false,
            'deserialize' => false,
            'validate' => false,
            'write' => false,
            'serialize' => true,
            'status' => Response::HTTP_OK,
            'normalization_context' => ['groups' => 'category_product_merchandising_result:read'],
            'openapi_context' => [
                'summary' => 'Get product positions in a category.',
                'description' => 'Get product positions in a category.',
                'parameters' => [
                    [
                        'name' => 'categoryId',
                        'in' => 'path',
                        'type' => 'string',
                        'required' => true,
                    ],
                    [
                        'name' => 'localizedCatalogId',
                        'in' => 'path',
                        'type' => 'int',
                        'required' => true,
                    ],
                ],
            ],
        ],
    ],
    graphql: [
        'savePositions' => [
            'mutation' => PositionSaveResolver::class,
            'args' => [
                'categoryId' => ['type' => 'String!'],
                'catalogId' => ['type' => 'Int'],
                'localizedCatalogId' => ['type' => 'Int'],
                'positions' => ['type' => 'String!'],
            ],
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'read' => false,
            'deserialize' => false,
            'write' => false,
            'serialize' => true,
            'normalization_context' => ['groups' => 'category_product_merchandising_result:read'],
        ],
        'getPositions' => [
            'item_query' => PositionGetResolver::class,
            'args' => [
                'categoryId' => ['type' => 'String!'],
                'localizedCatalogId' => ['type' => 'Int!'],
            ],
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'read' => false,
            'deserialize' => false,
            'write' => false,
            'serialize' => true,
            'normalization_context' => ['groups' => 'category_product_merchandising_result:read'],
        ],
    ],
    shortName: 'CategoryProductMerchandising',
)]
class ProductMerchandising
{
    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private int $id;

    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private Category $category;

    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private int $productId;

    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private ?Catalog $catalog = null;

    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private ?LocalizedCatalog $localizedCatalog = null;

    #[Groups(['category_product_merchandising:read', 'category_product_merchandising:write'])]
    private ?int $position;

    #[Groups(['category_product_merchandising_result:read'])]
    // This property is used to send a result in "category_position_save" endpoints (rest + graphql) as we can't return a position.
    // We use a property because it's not possible to use output with mutation.
    // @see https://github.com/api-platform/core/issues/3155
    private string $result = 'OK';

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCategory(): Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): void
    {
        $this->category = $category;
    }

    public function getProductId(): ?int
    {
        return $this->productId;
    }

    public function setProductId(?int $productId): void
    {
        $this->productId = $productId;
    }

    public function getCatalog(): ?Catalog
    {
        return $this->catalog;
    }

    public function setCatalog(?Catalog $catalog): void
    {
        $this->catalog = $catalog;
    }

    public function getLocalizedCatalog(): ?LocalizedCatalog
    {
        return $this->localizedCatalog;
    }

    public function setLocalizedCatalog(?LocalizedCatalog $localizedCatalog): void
    {
        $this->localizedCatalog = $localizedCatalog;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): void
    {
        $this->position = $position;
    }

    public function getResult(): string
    {
        return $this->result;
    }

    public function setResult(string $result): void
    {
        $this->result = $result;
    }
}
