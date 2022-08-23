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

class BasicSourceFieldConverter implements SourceFieldConverterInterface
{
    private array $typeMapping = [
        SourceField\Type::TYPE_KEYWORD => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
        SourceField\Type::TYPE_INT => Mapping\FieldInterface::FIELD_TYPE_INTEGER,
        SourceField\Type::TYPE_BOOLEAN => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
        SourceField\Type::TYPE_FLOAT => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
        // SourceField\Type::TYPE_IMAGE => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
        // SourceField\Type::TYPE_OBJECT => Mapping\FieldInterface::FIELD_TYPE_OBJECT,
    ];

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return \in_array($sourceField->getType(), array_keys($this->typeMapping), true);
    }

    /**
     * {@inheritDoc}
     */
    public function getFields(SourceField $sourceField): array
    {
        $fields = [];

        $fieldCode = $sourceField->getCode();

        $fieldType = $this->typeMapping[$sourceField->getType() ?: SourceField\Type::TYPE_KEYWORD];

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
        if ($sourceField->getIsSpellchecked()) {
            $fieldConfig['is_used_in_spellcheck'] = true;
        }

        $fields[$fieldCode] = new Mapping\Field($fieldCode, $fieldType, $path, $fieldConfig);

        return $fields;
    }
}
