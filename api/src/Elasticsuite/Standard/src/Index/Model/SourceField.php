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

namespace Elasticsuite\Index\Model;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ApiResource]
class SourceField
{
    private int $id;
    private string $name;
    private ?string $type = null;
    private ?int $weight = null;
    private ?bool $isSearchable = null;
    private ?bool $isFilterable = null;
    private ?bool $isSortable = null;
    private ?bool $isSpellchecked = null;
    private ?bool $isUsedForRules = null;

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

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(?int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function isSearchable(): ?bool
    {
        return $this->isSearchable;
    }

    public function setIsSearchable(?bool $isSearchable): self
    {
        $this->isSearchable = $isSearchable;

        return $this;
    }

    public function isFilterable(): ?bool
    {
        return $this->isFilterable;
    }

    public function setIsFilterable(?bool $isFilterable): self
    {
        $this->isFilterable = $isFilterable;

        return $this;
    }

    public function isSortable(): ?bool
    {
        return $this->isSortable;
    }

    public function setIsSortable(?bool $isSortable): self
    {
        $this->isSortable = $isSortable;

        return $this;
    }

    public function isSpellchecked(): ?bool
    {
        return $this->isSpellchecked;
    }

    public function setIsSpellchecked(?bool $isSpellchecked): self
    {
        $this->isSpellchecked = $isSpellchecked;

        return $this;
    }

    public function isUsedForRules(): ?bool
    {
        return $this->isUsedForRules;
    }

    public function setIsUsedForRules(?bool $isUsedForRules): self
    {
        $this->isUsedForRules = $isUsedForRules;

        return $this;
    }

    public function getMetadata(): ?Metadata
    {
        return $this->metadata;
    }

    public function setMetadata(?Metadata $metadata): self
    {
        $this->metadata = $metadata;

        return $this;
    }

    /**
     * @return Collection<SourceFieldLabel>
     */
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
