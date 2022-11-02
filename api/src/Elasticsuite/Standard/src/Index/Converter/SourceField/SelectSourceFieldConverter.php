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

class SelectSourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_SELECT === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $fieldCode = sprintf('%s.value', $sourceField->getCode());
        /*
         * Select attribute are supposed to contain a single value,
         * so it's supposed to avoid created a nested field and use instead an object.
         * This means it's not possible to support nested select fields for the moment, ie super.brand
         * to generate super.brand.value and super.brand.label
         */
        $path = null;
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
