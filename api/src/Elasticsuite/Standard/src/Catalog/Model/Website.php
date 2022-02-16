<?php

namespace Elasticsuite\Catalog\Model;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ApiResource]
class Website
{
    private $id;

    private $code;

    private $name;

    private $catalogs;

    public function __construct()
    {
        $this->catalogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|Catalog[]
     */
    public function getCatalogs(): Collection
    {
        return $this->catalogs;
    }

    public function addCatalog(Catalog $catalog): self
    {
        if (!$this->catalogs->contains($catalog)) {
            $this->catalogs[] = $catalog;
            $catalog->setWebsite($this);
        }

        return $this;
    }

    public function removeCatalog(Catalog $catalog): self
    {
        if ($this->catalogs->removeElement($catalog)) {
            // set the owning side to null (unless already changed)
            if ($catalog->getWebsite() === $this) {
                $catalog->setWebsite(null);
            }
        }

        return $this;
    }
}
