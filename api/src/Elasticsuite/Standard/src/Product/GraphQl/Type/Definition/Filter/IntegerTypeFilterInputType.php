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

namespace Elasticsuite\Product\GraphQl\Type\Definition\Filter;

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Constant\FilterOperator;
use GraphQL\Type\Definition\Type;

class IntegerTypeFilterInputType extends AbstractFilter
{
    public const NAME = 'ProductIntegerTypeFilterInput';

    public $name = self::NAME;

    public function supports(SourceField $sourceField): bool
    {
        return \in_array(
            $sourceField->getType(),
            [
                SourceField\Type::TYPE_INT,
            ], true
        );
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::int(),
                FilterOperator::IN => Type::listOf(Type::int()),
                FilterOperator::GTE => Type::int(),
                FilterOperator::GT => Type::int(),
                FilterOperator::LT => Type::int(),
                FilterOperator::LTE => Type::int(),
                FilterOperator::EXIST => Type::boolean(),
            ],
        ];
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (empty($inputData)) {
            $errors[] = sprintf(
                "Filter argument %s: At least '%s', '%s', '%s', '%s', '%s', '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::IN,
                FilterOperator::GTE,
                FilterOperator::GT,
                FilterOperator::LT,
                FilterOperator::LTE,
                FilterOperator::EXIST,
            );
        }

        if (isset($inputData[FilterOperator::GT]) && isset($inputData[FilterOperator::GTE])) {
            $errors[] = sprintf(
                "Filter argument %s: Do not use '%s' and '%s' in the same filter.",
                $argName,
                FilterOperator::GT,
                FilterOperator::GTE,
            );
        }

        if (isset($inputData[FilterOperator::LT]) && isset($inputData[FilterOperator::LTE])) {
            $errors[] = sprintf(
                "Filter argument %s: Do not use '%s' and '%s' in the same filter.",
                $argName,
                FilterOperator::LT,
                FilterOperator::LTE,
            );
        }

        return $errors;
    }

    public function validateValueType(string $field, string $operator, mixed $value): void
    {
        $this->validateValueTypeByType($field, $operator, $value, 'integer');
    }
}
