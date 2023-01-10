<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Catalog\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Elasticsuite\User\Constant\Role;
use Symfony\Component\Intl\Locales;
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
    normalizationContext: ['groups' => 'localizedCatalog:read']
)]

#[ApiFilter(SearchFilter::class, properties: ['code' => 'exact'])]
class LocalizedCatalog
{
    #[Groups(['localizedCatalog:read', 'catalog:read', 'source_field_option:read'])]
    private int $id;

    #[Groups(['localizedCatalog:read', 'catalog:read'])]
    private string|null $name;

    #[Groups(['localizedCatalog:read', 'catalog:read', 'source_field_option:read'])]
    private string $code;

    #[Groups(['localizedCatalog:read', 'catalog:read'])]
    private string $locale;

    #[Groups(['localizedCatalog:read', 'catalog:read'])]
    private string $currency;

    #[Groups(['localizedCatalog:read', 'catalog:read'])]
    private bool $isDefault = false;

    #[Groups('localizedCatalog:read')]
    private Catalog $catalog;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function setLocale(string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): void
    {
        $this->currency = $currency;
    }

    /**
     * It's important to keep the getter for isDefault property,
     * otherwise Api Platform will be not able to get the value in the response,
     * in other words don't rename by IsDefault().
     */
    public function getIsDefault(): bool
    {
        return $this->isDefault;
    }

    public function setIsDefault(bool $isDefault): self
    {
        $this->isDefault = $isDefault;

        return $this;
    }

    public function getCatalog(): ?Catalog
    {
        return $this->catalog;
    }

    public function setCatalog(?Catalog $catalog): self
    {
        $this->catalog = $catalog;

        return $this;
    }

    #[Groups(['localizedCatalog:read', 'catalog:read'])]
    public function getLocalName(): string
    {
        return Locales::getName($this->getLocale());
    }
}
