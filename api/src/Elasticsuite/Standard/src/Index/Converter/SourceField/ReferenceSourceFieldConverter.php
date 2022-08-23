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

class ReferenceSourceFieldConverter implements SourceFieldConverterInterface
{
    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_REFERENCE === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $fieldCode = $sourceField->getCode();
        $fieldType = Mapping\FieldInterface::FIELD_TYPE_TEXT;

        $path = explode('.', $fieldCode);
        unset($path[\count($path) - 1]);
        $path = \count($path) ? implode('.', $path) : null;

        $fieldConfig = [
            'is_searchable' => $sourceField->getIsSearchable(),
            'is_used_in_spellcheck' => $sourceField->getIsSpellchecked(),
            'is_filterable' => $sourceField->getIsFilterable() || $sourceField->getIsUsedForRules(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->getIsSortable(),
        ];
        $fieldConfig['default_search_analyzer'] = 'reference';

        $fields[$fieldCode] = new Mapping\Field($fieldCode, $fieldType, $path, $fieldConfig);

        if (empty($path)) {
            $fieldCode = sprintf('children.%s', $sourceField->getCode());
            // Flag explicitly the field as non-nested.
            $fields[$fieldCode] = new Mapping\Field($fieldCode, $fieldType, null, $fieldConfig);
        }

        return $fields;
    }
}
