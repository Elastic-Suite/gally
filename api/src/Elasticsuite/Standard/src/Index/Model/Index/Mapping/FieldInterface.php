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
 * Representation of an Elasticsearch field (abstraction of mapping properties).
 */
interface FieldInterface
{
    /**
     * Field types declaration.
     */
    public const FIELD_TYPE_TEXT = 'text';
    public const FIELD_TYPE_KEYWORD = 'keyword';
    public const FIELD_TYPE_DOUBLE = 'double';
    public const FIELD_TYPE_INTEGER = 'integer';
    public const FIELD_TYPE_LONG = 'long';
    public const FIELD_TYPE_DATE = 'date';
    public const FIELD_TYPE_BOOLEAN = 'boolean';
    public const FIELD_TYPE_NESTED = 'nested';
    public const FIELD_TYPE_OBJECT = 'object';

    public function getName(): string;

    public function getType(): string;

    public function isSearchable(): bool;

    public function isFilterable(): bool;

    public function isUsedForSortBy(): bool;

    public function isUsedInSpellcheck(): bool;

    public function getSearchWeight(): int;

    /**
     * Return true if the field has a nested path.
     */
    public function isNested(): bool;

    /**
     * Returns nested path for the field (Example : "category" for "category.position").
     */
    public function getNestedPath(): ?string;

    /**
     * Get nested field name (Example: "position" for "category.position").
     * Returns null for non nested fields.
     */
    public function getNestedFieldName(): ?string;

    /**
     * Return ES mapping properties associated with the field.
     */
    public function getMappingPropertyConfig(): array;
}
