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

namespace Elasticsuite\Index\Converter\SourceField;

use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Metadata\Model\SourceField;

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

        foreach ($innerFields as $fieldName => $fieldType) {
            $fieldConfig = (Mapping\FieldInterface::FIELD_TYPE_TEXT === $fieldType) ? $textFieldConfig : [];
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
        // Might depend from global configuration in the future.
        return [
            'id' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
            'uid' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
            'name' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
            'is_parent' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
            'is_virtual' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
            'is_blacklisted' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
            'position' => Mapping\FieldInterface::FIELD_TYPE_INTEGER,
        ];
    }
}
