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

namespace Elasticsuite\Index\Converter;

use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Metadata\Model\SourceField;

class SourceFieldToMappingField
{
    private array $typeMapping = [
        SourceField\Type::TYPE_TEXT => Mapping\FieldInterface::FIELD_TYPE_TEXT,
        SourceField\Type::TYPE_SELECT => Mapping\FieldInterface::FIELD_TYPE_TEXT,
        SourceField\Type::TYPE_INT => Mapping\FieldInterface::FIELD_TYPE_INTEGER,
        SourceField\Type::TYPE_FLOAT => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
        SourceField\Type::TYPE_PRICE => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
        SourceField\Type::TYPE_REFERENCE => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
        SourceField\Type::TYPE_IMAGE => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
        SourceField\Type::TYPE_OBJECT => Mapping\FieldInterface::FIELD_TYPE_OBJECT,
    ];

    /**
     * Create a mapping field from a source field.
     */
    public function convert(SourceField $sourceField): Mapping\FieldInterface
    {
        $fieldName = $sourceField->getName();

        $fieldType = $this->typeMapping[$sourceField->getType() ?: SourceField\Type::TYPE_TEXT];

        $path = explode('.', $fieldName);
        unset($path[\count($path) - 1]);
        $path = \count($path) ? implode('.', $path) : null;

        $fieldConfig = [
            'is_searchable' => $sourceField->isSearchable(),
            'is_filterable' => $sourceField->isFilterable(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->isSortable(),
        ];
        if ($sourceField->isSpellchecked()) {
            $fieldConfig['is_used_in_spellcheck'] = true;
        }

        return new Mapping\Field($fieldName, $fieldType, $path, $fieldConfig);
    }
}
