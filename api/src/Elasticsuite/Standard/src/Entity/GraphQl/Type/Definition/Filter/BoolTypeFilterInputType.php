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

namespace Elasticsuite\Entity\GraphQl\Type\Definition\Filter;

use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Constant\FilterOperator;
use GraphQL\Type\Definition\Type;

class BoolTypeFilterInputType extends IntegerTypeFilterInputType
{
    public const NAME = 'EntityBoolTypeFilterInput';

    public $name = self::NAME;

    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_BOOLEAN === $sourceField->getType();
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::boolean(),
                FilterOperator::EXIST => Type::boolean(),
            ],
        ];
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (\count($inputData) < 1) {
            $errors[] = sprintf(
                "Filter argument %s: At least '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::EXIST,
            );
        }

        if (\count($inputData) > 1) {
            $errors[] = sprintf(
                "Filter argument %s: Only '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::EXIST,
            );
        }

        return $errors;
    }

    public function validateValueType(string $field, string $operator, mixed $value): void
    {
        $this->validateValueTypeByType($field, $operator, $value, 'bool');
    }
}
