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

namespace Elasticsuite\Category\Model\Category;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Elasticsuite\Catalog\Model\Catalog;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Category\Controller\CategoryConfigurationGet;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Resolver\ConfigurationResolver;
use Elasticsuite\User\Constant\Role;

#[ApiResource(
    collectionOperations: [
        'get' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'post' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    itemOperations: [
        'get' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'get_by_context' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'method' => 'GET',
            'path' => '/category_configurations/category/{categoryId}',
            'controller' => CategoryConfigurationGet::class,
            'read' => false,
            'openapi_context' => [
                'parameters' => [
                    [
                        'name' => 'categoryId',
                        'in' => 'path',
                        'type' => 'Category',
                        'required' => true,
                    ],
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
        'put' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'patch' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    graphql: [
        'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'item_query' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'collection_query' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'get' => [
            'item_query' => ConfigurationResolver::class,
            'args' => [
                'categoryId' => ['type' => 'String!'],
                'catalogId' => ['type' => 'Int'],
                'localizedCatalogId' => ['type' => 'Int'],
            ],
        ],
    ],
    shortName: 'CategoryConfiguration',
)]
#[ApiFilter(SearchFilter::class, properties: ['category' => 'exact'])]
#[ApiFilter(SearchFilter::class, properties: ['catalog' => 'exact'])]
#[ApiFilter(SearchFilter::class, properties: ['localized_catalog' => 'exact'])]
class Configuration
{
    private int $id;

    private Category $category;

    private ?Catalog $catalog;

    private ?LocalizedCatalog $localizedCatalog;

    private ?string $name = null;

    private ?bool $useNameInProductSearch = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'elasticsuite' => [
                    'input' => 'dropdown',
                    'options' => [
                        'api_rest' => '/category_sorting_options',
                        'api_gaphql' => 'categorySortingOptions',
                    ],
                ],
            ],
        ],
    )]
    private ?string $defaultSorting = null;

    private bool $isActive = true;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getUseNameInProductSearch(): bool
    {
        return $this->useNameInProductSearch ?? true;
    }

    public function setUseNameInProductSearch(?bool $useNameInProductSearch): void
    {
        $this->useNameInProductSearch = $useNameInProductSearch;
    }

    public function getDefaultSorting(): string
    {
        return $this->defaultSorting ?? 'position';
    }

    public function setDefaultSorting(?string $defaultSorting): void
    {
        $this->defaultSorting = $defaultSorting;
    }

    public function getIsActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): void
    {
        $this->isActive = $isActive;
    }
}
