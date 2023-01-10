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

class StockSourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_STOCK === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $path = $sourceField->getCode();
        /*
         * Do NOT support nested stock source fields for the moment, ie super.my_stock
         * to generate super.my_stock.status, super.my_stock.qty, etc.
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
        // Possible additional fields in the future.
        return [
            'status' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
            'qty' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
        ];
    }
}
