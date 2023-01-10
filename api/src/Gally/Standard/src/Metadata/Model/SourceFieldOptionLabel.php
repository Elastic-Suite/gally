<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Metadata\Model;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\User\Constant\Role;
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
    normalizationContext: ['groups' => ['source_field_option_label:read']],
    denormalizationContext: ['groups' => ['source_field_option_label:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['catalog' => 'exact', 'sourceFieldOption.sourceField' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['sourceFieldOption.position'], arguments: ['orderParameterName' => 'order'])]
class SourceFieldOptionLabel
{
    #[Groups(['source_field_option_label:read', 'source_field_option_label:write'])]
    private int $id;

    #[Groups(['source_field_option_label:read', 'source_field_option_label:write'])]
    private SourceFieldOption $sourceFieldOption;

    #[Groups(['source_field_option_label:read', 'source_field_option_label:write', 'source_field_option:read'])]
    private LocalizedCatalog $catalog;

    #[Groups(['source_field_option_label:read', 'source_field_option_label:write', 'source_field_option:read'])]
    private string $label;

    public function getId(): int
    {
        return $this->id;
    }

    public function getSourceFieldOption(): ?SourceFieldOption
    {
        return $this->sourceFieldOption;
    }

    public function setSourceFieldOption(?SourceFieldOption $sourceFieldOption): self
    {
        $this->sourceFieldOption = $sourceFieldOption;

        return $this;
    }

    public function getCatalog(): ?LocalizedCatalog
    {
        return $this->catalog;
    }

    public function setCatalog(?LocalizedCatalog $catalog): self
    {
        $this->catalog = $catalog;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): self
    {
        $this->label = $label;

        return $this;
    }
}
