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

namespace Gally\Index\Model\Index\Mapping;

use Gally\Search\Elasticsearch\Request\SortOrderInterface;

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

    /**
     * Analyzers declarations.
     */
    public const ANALYZER_STANDARD = 'standard';
    public const ANALYZER_WHITESPACE = 'whitespace';
    public const ANALYZER_SHINGLE = 'shingle';
    public const ANALYZER_SORTABLE = 'sortable';
    public const ANALYZER_PHONETIC = 'phonetic';
    public const ANALYZER_UNTOUCHED = 'untouched';
    public const ANALYZER_KEYWORD = 'keyword';

    /**
     * Field filter logical operators.
     */
    public const FILTER_LOGICAL_OPERATOR_OR = 0;
    public const FILTER_LOGICAL_OPERATOR_AND = 1;

    public function getName(): string;

    public function getType(): string;

    public function getConfig(): array;

    public function isSearchable(): bool;

    public function isFilterable(): bool;

    public function isUsedForSortBy(): bool;

    public function isUsedInSpellcheck(): bool;

    public function getSearchWeight(): int;

    public function normsDisabled(): bool;

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

    /**
     * Return ES property name eventually using a specified analyzer.
     *
     * @param string $analyzer Analyzer for multi_type / string fields
     */
    public function getMappingProperty(string $analyzer = self::ANALYZER_UNTOUCHED): ?string;

    /**
     * Return the search analyzer used by default for fulltext searches.
     */
    public function getDefaultSearchAnalyzer(): string;

    /**
     * Retrieve the directive to apply for "missing" when the field is used for sort by.
     *
     * @param string $direction The direction used to sort
     */
    public function getSortMissing(string $direction = SortOrderInterface::SORT_ASC): mixed;

    /**
     * Retrieve the logical operator to use when building a filter combining multiple values: OR (default) or AND.
     */
    public function getFilterLogicalOperator(): int;
}
