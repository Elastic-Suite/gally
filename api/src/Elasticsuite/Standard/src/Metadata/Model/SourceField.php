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

namespace Elasticsuite\Metadata\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
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
    normalizationContext: ['groups' => ['source_field:api']],
    denormalizationContext: ['groups' => ['source_field:api']],
)]
#[ApiFilter(BooleanFilter::class, properties: ['isSearchable', 'isFilterable'])]
#[ApiFilter(SearchFilter::class, properties: ['code' => 'partial', 'defaultLabel' => 'partial', 'type' => 'partial', 'metadata' => 'exact'])]
class SourceField
{
    private int $id;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Attribute code',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private string $code;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Attribute label',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private ?string $defaultLabel = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Attribute type',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private ?string $type = null;
    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Filterable',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private ?bool $isFilterable = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Searchable',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private ?bool $isSearchable = null;

    #[ApiProperty(
        attributes: [
            'hydra:supportedProperty' => [
                'hydra:property' => [
                    'rdfs:label' => 'Sortable',
                    'showable' => true,
                ],
            ],
        ],
    )]
    private ?bool $isSortable = null;

    private ?int $weight = null;
    private ?bool $isSpellchecked = null;
    private ?bool $isUsedForRules = null;
    private bool $isSystem = false;

    private Metadata $metadata;

    /** @var Collection<SourceFieldLabel> */
    private Collection $labels;

    /** @var Collection<SourceFieldOption> */
    private Collection $options;

    public function __construct()
    {
        $this->labels = new ArrayCollection();
        $this->options = new ArrayCollection();
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getId(): int
    {
        return $this->id;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getCode(): string
    {
        return $this->code;
    }

    #[Groups(['source_field:api'])]
    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getDefaultLabel(): string
    {
        return $this->defaultLabel ?: ucfirst($this->getCode());
    }

    #[Groups(['source_field:api'])]
    public function setDefaultLabel(string $defaultLabel): self
    {
        $this->defaultLabel = $defaultLabel;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getType(): ?string
    {
        return $this->type;
    }

    #[Groups(['source_field:api'])]
    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getWeight(): ?int
    {
        return $this->weight;
    }

    #[Groups(['source_field:api'])]
    public function setWeight(?int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsSearchable(): ?bool
    {
        return $this->isSearchable;
    }

    #[Groups(['source_field:api'])]
    public function setIsSearchable(?bool $isSearchable): self
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsFilterable(): ?bool
    {
        return $this->isFilterable;
    }

    #[Groups(['source_field:api'])]
    public function setIsFilterable(?bool $isFilterable): self
    {
        $this->isFilterable = $isFilterable;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsSortable(): ?bool
    {
        return $this->isSortable;
    }

    #[Groups(['source_field:api'])]
    public function setIsSortable(?bool $isSortable): self
    {
        $this->isSortable = $isSortable;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsSpellchecked(): ?bool
    {
        return $this->isSpellchecked;
    }

    #[Groups(['source_field:api'])]
    public function setIsSpellchecked(?bool $isSpellchecked): self
    {
        $this->isSpellchecked = $isSpellchecked;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsUsedForRules(): ?bool
    {
        return $this->isUsedForRules;
    }

    #[Groups(['source_field:api'])]
    public function setIsUsedForRules(?bool $isUsedForRules): self
    {
        $this->isUsedForRules = $isUsedForRules;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getIsSystem(): bool
    {
        return $this->isSystem;
    }

    public function setIsSystem(bool $isSystem): self
    {
        $this->isSystem = $isSystem;

        return $this;
    }

    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getMetadata(): ?Metadata
    {
        return $this->metadata;
    }

    #[Groups(['source_field:api'])]
    public function setMetadata(?Metadata $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    /**
     * @return Collection<SourceFieldLabel>
     */
    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getLabels(): Collection
    {
        return $this->labels;
    }

    public function getLabel(int $catalogId): string
    {
        foreach ($this->getLabels() as $label) {
            if ($catalogId === $label->getCatalog()->getId()) {
                return $label->getLabel();
            }
        }

        return $this->getDefaultLabel();
    }

    public function addLabel(SourceFieldLabel $label): self
    {
        if (!$this->labels->contains($label)) {
            $this->labels[] = $label;
            $label->setSourceField($this);
        }

        return $this;
    }

    public function removeLabel(SourceFieldLabel $label): self
    {
        if ($this->labels->removeElement($label)) {
            if ($label->getSourceField() === $this) {
                $label->setSourceField(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<SourceFieldOption>
     */
    #[Groups(['source_field:api', 'facet_configuration:graphql_read'])]
    public function getOptions(): Collection
    {
        return $this->options;
    }

    public function addOption(SourceFieldOption $option): self
    {
        if (!$this->options->contains($option)) {
            $this->options[] = $option;
            $option->setSourceField($this);
        }

        return $this;
    }

    public function removeOption(SourceFieldOption $option): self
    {
        if ($this->options->removeElement($option)) {
            if ($option->getSourceField() === $this) {
                $option->setSourceField(null);
            }
        }

        return $this;
    }
}
