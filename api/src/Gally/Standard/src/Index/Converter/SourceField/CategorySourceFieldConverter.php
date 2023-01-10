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

namespace Gally\Index\Converter\SourceField;

use Gally\Index\Model\Index\Mapping;
use Gally\Metadata\Model\SourceField;

class CategorySourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_CATEGORY === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $path = $sourceField->getCode();
        /*
         * Do NOT support nested category source fields for the moment, ie super.category
         * to generate super.category.id, super.category.name, etc.
         * ---
         * $path = $sourceField->getNestedPath();
         */
        $innerFields = $this->getInnerFieldsConfig($sourceField);

        $textFieldConfig = [
            'is_searchable' => $sourceField->getIsSearchable(),
            'is_used_in_spellcheck' => $sourceField->getIsSpellchecked(),
            'is_filterable' => $sourceField->getIsFilterable() || $sourceField->getIsUsedForRules(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->getIsSortable(),
        ];

        foreach ($innerFields as $fieldName => $innerFieldConfig) {
            $fieldType = $innerFieldConfig['type'];
            $fieldConfig = [];
            if (Mapping\FieldInterface::FIELD_TYPE_TEXT === $fieldType) {
                $inheritedConfig = $innerFieldConfig['inherit'] ?? [];
                if (!empty($inheritedConfig)) {
                    $fieldConfig = array_intersect_key($textFieldConfig, array_fill_keys($inheritedConfig, true));
                }
                $explicitConfig = $innerFieldConfig['explicit'] ?? [];
                if (!empty($explicitConfig)) {
                    $fieldConfig += $explicitConfig;
                }
            }
            $finalFieldName = sprintf('%s.%s', $path, $fieldName);
            $fields[$finalFieldName] = new Mapping\Field(
                $finalFieldName,
                $fieldType,
                $path,
                $fieldConfig
            );
        }

        return $fields;
    }

    protected function getInnerFieldsConfig(SourceField $sourceField): array
    {
        // Might depend upon global configuration in the future.
        return [
            'id' => ['type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD],
            'uid' => ['type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD],
            'name' => [
                'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                'inherit' => ['is_filterable'],
            ],
            '_name' => [
                'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                'inherit' => ['is_searchable', 'is_used_in_spellcheck', 'search_weight'],
                'explicit' => ['is_filterable' => false],
            ],
            'is_parent' => ['type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN],
            'is_virtual' => ['type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN],
            'is_blacklisted' => ['type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN],
            'position' => ['type' => Mapping\FieldInterface::FIELD_TYPE_INTEGER],
        ];
    }
}
