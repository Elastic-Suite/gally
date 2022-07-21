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

namespace Elasticsuite\Category\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Category\Resolver\CategoryTreeResolver;
use Elasticsuite\User\Constant\Role;

#[ApiResource(
    collectionOperations: [],
    itemOperations: [
        'get' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
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
