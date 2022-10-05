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

class PriceSourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_PRICE === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $path = $sourceField->getCode();
        /*
         * Do NOT support nested price source fields for the moment, ie super.my_price
         * to generate super.my_price.original_price, super.my_price.price, etc.
         * ---
         * $path = $sourceField->getNestedPath();
         */
        $innerFields = $this->getInnerFieldsConfig($sourceField);

        $fieldConfig = [
            'is_searchable' => $sourceField->getIsSearchable(),
            'is_used_in_spellcheck' => $sourceField->getIsSpellchecked(),
            'is_filterable' => $sourceField->getIsFilterable() || $sourceField->getIsUsedForRules(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->getIsSortable(),
        ];

        foreach ($innerFields as $fieldName => $fieldType) {
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
        // Will depend from global configuration in the future.
        return [
            'original_price' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
            'price' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
            'is_discounted' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
            'group_id' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
            // 'currency' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
            // 'is_dynamic' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
        ];
    }
}
