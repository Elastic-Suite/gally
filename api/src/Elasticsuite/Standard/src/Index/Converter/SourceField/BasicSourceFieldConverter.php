<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
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
        SourceField\Type::TYPE_DATE => Mapping\FieldInterface::FIELD_TYPE_DATE,
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

        $path = $sourceField->getNestedPath();

        $fieldConfig = [
            'is_searchable' => $sourceField->getIsSearchable(),
            'is_used_in_spellcheck' => $sourceField->getIsSpellchecked(),
            'is_filterable' => $sourceField->getIsFilterable() || $sourceField->getIsUsedForRules(),
            'search_weight' => $sourceField->getWeight(),
            'is_used_for_sort_by' => $sourceField->getIsSortable(),
        ];

        $fields[$fieldCode] = new Mapping\Field($fieldCode, $fieldType, $path, $fieldConfig);

        return $fields;
    }
}
