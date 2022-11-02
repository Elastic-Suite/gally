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

class MultiSelectSourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_MULTISELECT === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $fieldCode = sprintf('%s.value', $sourceField->getCode());
        $path = $sourceField->getCode();
        /*
         * Multiselect fields are created are nested fields, so it is not possible
         * to support nested multiselect fields for the moment, ie super.color
         * to generate super.color.value and super.color.label
         */
        $fields[$fieldCode] = new Mapping\Field($fieldCode, Mapping\FieldInterface::FIELD_TYPE_KEYWORD, $path);

        $fieldCode = sprintf('%s.label', $sourceField->getCode());
        $fieldConfig = [
            'is_searchable' => $sourceField->getIsSearchable(),
            'is_used_in_spellcheck' => $sourceField->getIsSpellchecked(),
            'is_filterable' => $sourceField->getIsFilterable() || $sourceField->getIsUsedForRules(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->getIsSortable(),
        ];

        $fields[$fieldCode] = new Mapping\Field($fieldCode, Mapping\FieldInterface::FIELD_TYPE_TEXT, $path, $fieldConfig);

        return $fields;
    }
}
