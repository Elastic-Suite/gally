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

namespace Elasticsuite\Index\Model\Index\Mapping;

/**
 * Default implementation for ES mapping field (Smile\ElasticsuiteCore\Api\Index\Mapping\FieldInterface).
 */
class Field implements FieldInterface
{
    private string $name;

    private string $type;

    private ?string $nestedPath;

    private array $config = [
        'is_searchable' => false,
        'is_filterable' => true,
        'is_used_for_sort_by' => false,
        'is_used_in_spellcheck' => false,
        'search_weight' => 1,
    ];

    /**
     * Constructor.
     *
     * @param string      $name        field name
     * @param string      $type        field type
     * @param string|null $nestedPath  Path for nested fields. null by default and for non-nested fields.
     * @param array       $fieldConfig field configuration (see self::$config declaration for
     *                                 available values and default values)
     */
    public function __construct(
        string $name,
        string $type = self::FIELD_TYPE_KEYWORD,
        ?string $nestedPath = null,
        array $fieldConfig = []
    ) {
        $this->name = $name;
        $this->type = $type;
        $this->config = $fieldConfig + $this->config;
        $this->nestedPath = $nestedPath;

        if (null !== $nestedPath && !str_starts_with($name, $nestedPath . '.')) {
            throw new \InvalidArgumentException('Invalid nested path or field name');
        }
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function isSearchable(): bool
    {
        return (bool) $this->config['is_searchable'];
    }

    public function isFilterable(): bool
    {
        return (bool) $this->config['is_filterable'];
    }

    public function isUsedForSortBy(): bool
    {
        return (bool) $this->config['is_used_for_sort_by'];
    }

    public function isUsedInSpellcheck(): bool
    {
        return $this->config['is_used_in_spellcheck'] && $this->config['is_searchable'];
    }

    public function getSearchWeight(): int
    {
        return (int) $this->config['search_weight'];
    }

    public function isNested(): bool
    {
        return \is_string($this->nestedPath) && !empty($this->nestedPath);
    }

    public function getNestedPath(): ?string
    {
        return $this->nestedPath;
    }

    public function getNestedFieldName(): ?string
    {
        return $this->isNested()
            ? str_replace($this->getNestedPath() . '.', '', $this->getName())
            : null;
    }

    public function getMappingPropertyConfig(): array
    {
        return ['type' => $this->getType()];
    }
}
