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

namespace Elasticsuite\Catalog\Model;

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
    normalizationContext: ['groups' => 'catalog:read']
)]
class Catalog
{
    #[Groups('catalog:read')]
    private int $id;

    #[Groups('catalog:read')]
    private string $code;

    #[Groups('catalog:read')]
    private string|null $name;

    /** @var \Doctrine\Common\Collections\Collection&iterable<\Elasticsuite\Catalog\Model\LocalizedCatalog> */
    #[Groups('catalog:read')]
    private Collection $localizedCatalogs;

    public function __construct()
    {
        $this->localizedCatalogs = new ArrayCollection();
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
     * @return Collection&iterable<\Elasticsuite\Catalog\Model\LocalizedCatalog>
     */
    public function getLocalizedCatalogs(): Collection
    {
        return $this->localizedCatalogs;
    }

    public function addLocalizedCatalog(LocalizedCatalog $localizedCatalog): self
    {
        if (!$this->localizedCatalogs->contains($localizedCatalog)) {
            $this->localizedCatalogs[] = $localizedCatalog;
            $localizedCatalog->setCatalog($this);
        }

        return $this;
    }

    public function removeLocalizedCatalog(LocalizedCatalog $localizedCatalog): self
    {
        if ($this->localizedCatalogs->removeElement($localizedCatalog)) {
            if ($localizedCatalog->getCatalog() === $this) {
                $localizedCatalog->setCatalog(null);
            }
        }

        return $this;
    }
}
