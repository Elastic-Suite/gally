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

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'FacetConfiguration',
    collectionOperations: [
        'get',
    ],
    itemOperations: [
        'get',
        'put' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'patch' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    graphql: [
        'item_query' => [
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
        ],
        'collection_query' => [
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
        ],
        'update' => [
            'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            'normalization_context' => ['groups' => ['facet_configuration:read', 'facet_configuration:graphql_read']],
            'denormalization_context' => ['groups' => ['facet_configuration:write']],
        ],
        'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
    ],
    normalizationContext: ['groups' => ['facet_configuration:read']],
    denormalizationContext: ['groups' => ['facet_configuration:read']],
)]
#[ApiFilter(SearchFilter::class, properties: ['category' => 'exact'])]
class Configuration
{
    #[Groups(['facet_configuration:read'])]
    private string $id;

    #[Groups(['facet_configuration:read'])]
    private SourceField $sourceField;

    #[Groups(['facet_configuration:read'])]
    private ?Category $category;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?string $displayMode = null;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?int $coverageRate = null;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?int $maxSize = null;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?string $sortOrder = null;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?bool $isRecommendable = null;

    #[Groups(['facet_configuration:read', 'facet_configuration:write'])]
    private ?bool $isVirtual = null;

    #[Groups(['facet_configuration:read'])]
    private ?string $defaultDisplayMode = null;

    #[Groups(['facet_configuration:read'])]
    private ?int $defaultCoverageRate = null;

    #[Groups(['facet_configuration:read'])]
    private ?int $defaultMaxSize = null;

    #[Groups(['facet_configuration:read'])]
    private ?string $defaultSortOrder = null;

    #[Groups(['facet_configuration:read'])]
    private ?bool $defaultIsRecommendable = null;

    #[Groups(['facet_configuration:read'])]
    private ?bool $defaultIsVirtual = null;

    public function __construct(SourceField $sourceField, ?Category $category)
    {
        $this->sourceField = $sourceField;
        $this->category = $category;
        $this->id = implode('-', [$sourceField->getId(), $category ? $category->getId() : 0]);
    }

    public function getId(): string
    {
        return $this->id;
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
        return $this->displayMode ?? $this->getDefaultDisplayMode();
    }

    public function setDisplayMode(?string $displayMode): void
    {
        $this->displayMode = '' == $displayMode ? null : $displayMode;
    }

    public function getCoverageRate(): ?int
    {
        return $this->coverageRate ?? $this->getDefaultCoverageRate();
    }

    public function setCoverageRate(?int $coverageRate): void
    {
        $this->coverageRate = '' == $coverageRate ? null : $coverageRate;
    }

    public function getMaxSize(): ?int
    {
        return $this->maxSize ?? $this->getDefaultMaxSize();
    }

    public function setMaxSize(?int $maxSize): void
    {
        $this->maxSize = $maxSize;
    }

    public function getSortOrder(): ?string
    {
        return $this->sortOrder ?? $this->getDefaultSortOrder();
    }

    public function setSortOrder(?string $sortOrder): void
    {
        $this->sortOrder = $sortOrder;
    }

    public function getIsRecommendable(): ?bool
    {
        return $this->isRecommendable ?? $this->getDefaultIsRecommendable();
    }

    public function setIsRecommendable(?bool $isRecommendable): void
    {
        $this->isRecommendable = $isRecommendable;
    }

    public function getIsVirtual(): ?bool
    {
        return $this->isVirtual ?? $this->getDefaultIsVirtual();
    }

    public function setIsVirtual(?bool $isVirtual): void
    {
        $this->isVirtual = $isVirtual;
    }

    public function getDefaultDisplayMode(): ?string
    {
        return $this->defaultDisplayMode;
    }

    public function getDefaultCoverageRate(): ?int
    {
        return $this->defaultCoverageRate;
    }

    public function getDefaultMaxSize(): ?int
    {
        return $this->defaultMaxSize;
    }

    public function getDefaultSortOrder(): ?string
    {
        return $this->defaultSortOrder;
    }

    public function getDefaultIsRecommendable(): ?bool
    {
        return $this->defaultIsRecommendable;
    }

    public function getDefaultIsVirtual(): ?bool
    {
        return $this->defaultIsVirtual;
    }

    public function initDefaultValue(self $defaultConfiguration)
    {
        $this->defaultDisplayMode = $defaultConfiguration->getDisplayMode() ?? 'auto';
        $this->defaultCoverageRate = $defaultConfiguration->getCoverageRate() ?? 90;
        $this->defaultMaxSize = $defaultConfiguration->getMaxSize() ?? 10;
        $this->defaultSortOrder = $defaultConfiguration->getSortOrder() ?? 'result_count';
        $this->defaultIsRecommendable = $defaultConfiguration->getIsRecommendable() ?? false;
        $this->defaultIsVirtual = $defaultConfiguration->getIsVirtual() ?? false;
    }
}
