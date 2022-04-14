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

use ApiPlatform\Core\Annotation\ApiResource;
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
    normalizationContext: ['groups' => ['api']],
    denormalizationContext: ['groups' => ['api']],
)]
class SourceField
{
    private int $id;
    private string $name;
    private ?string $defaultLabel = null;
    private ?string $type = null;
    private ?int $weight = null;
    private ?bool $isSearchable = null;
    private ?bool $isFilterable = null;
    private ?bool $isSortable = null;
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

    #[Groups(['api'])]
    public function getId(): int
    {
        return $this->id;
    }

    #[Groups(['api'])]
    public function getName(): string
    {
        return $this->name;
    }

    #[Groups(['api'])]
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    #[Groups(['api'])]
    public function getDefaultLabel(): string
    {
        return $this->defaultLabel ?: ucfirst($this->getName());
    }

    #[Groups(['api'])]
    public function setDefaultLabel(string $defaultLabel): self
    {
        $this->defaultLabel = $defaultLabel;

        return $this;
    }

    #[Groups(['api'])]
    public function getType(): ?string
    {
        return $this->type;
    }

    #[Groups(['api'])]
    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    #[Groups(['api'])]
    public function getWeight(): ?int
    {
        return $this->weight;
    }

    #[Groups(['api'])]
    public function setWeight(?int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    #[Groups(['api'])]
    public function isSearchable(): ?bool
    {
        return $this->isSearchable;
    }

    #[Groups(['api'])]
    public function setIsSearchable(?bool $isSearchable): self
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    #[Groups(['api'])]
    public function isFilterable(): ?bool
    {
        return $this->isFilterable;
    }

    #[Groups(['api'])]
    public function setIsFilterable(?bool $isFilterable): self
    {
        $this->isFilterable = $isFilterable;

        return $this;
    }

    #[Groups(['api'])]
    public function isSortable(): ?bool
    {
        return $this->isSortable;
    }

    #[Groups(['api'])]
    public function setIsSortable(?bool $isSortable): self
    {
        $this->isSortable = $isSortable;

        return $this;
    }

    #[Groups(['api'])]
    public function isSpellchecked(): ?bool
    {
        return $this->isSpellchecked;
    }

    #[Groups(['api'])]
    public function setIsSpellchecked(?bool $isSpellchecked): self
    {
        $this->isSpellchecked = $isSpellchecked;

        return $this;
    }

    #[Groups(['api'])]
    public function isUsedForRules(): ?bool
    {
        return $this->isUsedForRules;
    }

    #[Groups(['api'])]
    public function setIsUsedForRules(?bool $isUsedForRules): self
    {
        $this->isUsedForRules = $isUsedForRules;

        return $this;
    }

    #[Groups(['api'])]
    public function isSystem(): bool
    {
        return $this->isSystem;
    }

    public function setIsSystem(bool $isSystem): self
    {
        $this->isSystem = $isSystem;

        return $this;
    }

    #[Groups(['api'])]
    public function getMetadata(): ?Metadata
    {
        return $this->metadata;
    }

    #[Groups(['api'])]
    public function setMetadata(?Metadata $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    /**
     * @return Collection<SourceFieldLabel>
     */
    #[Groups(['api'])]
    public function getLabels(): Collection
    {
        return $this->labels;
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
    #[Groups(['api'])]
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
