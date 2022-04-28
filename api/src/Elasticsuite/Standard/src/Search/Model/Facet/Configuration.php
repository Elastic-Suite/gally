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

namespace Elasticsuite\Search\Model\Facet;

use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\User\Constant\Role;

#[ApiResource(
    shortName: 'FacetConfiguration',
    collectionOperations: [
        'get',
        'post' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    itemOperations: [
        'get',
        'put' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'patch' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    graphql: [
        'item_query',
        'collection_query',
        'create' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'update' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
)]
class Configuration
{
    private int $id;

    private SourceField $sourceField;

    private ?Category $category;

    private ?string $displayMode;

    private ?int $coverageRate;

    private ?int $maxSize;

    private ?string $sortOrder;

    private ?bool $isRecommendable;

    private ?bool $isVirtual;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getSourceField(): SourceField
    {
        return $this->sourceField;
    }

    public function setSourceField(SourceField $sourceField): void
    {
        $this->sourceField = $sourceField;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): void
    {
        $this->category = $category;
    }

    public function getDisplayMode(): ?string
    {
        return $this->displayMode;
    }

    public function setDisplayMode(?string $displayMode): void
    {
        $this->displayMode = $displayMode;
    }

    public function getCoverageRate(): ?int
    {
        return $this->coverageRate;
    }

    public function setCoverageRate(?int $coverageRate): void
    {
        $this->coverageRate = $coverageRate;
    }

    public function getMaxSize(): ?int
    {
        return $this->maxSize;
    }

    public function setMaxSize(?int $maxSize): void
    {
        $this->maxSize = $maxSize;
    }

    public function getSortOrder(): ?string
    {
        return $this->sortOrder;
    }

    public function setSortOrder(?string $sortOrder): void
    {
        $this->sortOrder = $sortOrder;
    }

    public function isRecommendable(): ?bool
    {
        return $this->isRecommendable;
    }

    public function setIsRecommendable(?bool $isRecommendable): void
    {
        $this->isRecommendable = $isRecommendable;
    }

    public function isVirtual(): ?bool
    {
        return $this->isVirtual;
    }

    public function setIsVirtual(?bool $isVirtual): void
    {
        $this->isVirtual = $isVirtual;
    }
}
