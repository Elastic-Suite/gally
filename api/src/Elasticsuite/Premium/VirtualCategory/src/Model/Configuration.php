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

namespace Elasticsuite\VirtualCategory\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\ScopedEntity\Model\AbstractEntity as ScopedEntity;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\VirtualCategory\Resolver\ConfigurationResolver;

#[ApiResource(
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
    shortName: 'CategoryVirtualConfiguration',
)]
#[ApiFilter(SearchFilter::class, properties: ['category' => 'exact'])]
#[ApiFilter(SearchFilter::class, properties: ['catalog' => 'exact'])]
#[ApiFilter(SearchFilter::class, properties: ['localized_catalog' => 'exact'])]
class Configuration extends ScopedEntity
{
    private int $id;

    private Category $category;

    private ?bool $isVirtual = null;

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

    public function getIsVirtual(): bool
    {
        return $this->isVirtual ?? false;
    }

    public function setIsVirtual(?bool $isVirtual): void
    {
        $this->isVirtual = $isVirtual;
    }
}
