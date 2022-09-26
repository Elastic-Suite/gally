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

class FloatTypeFilterInputType extends IntegerTypeFilterInputType
{
    public const NAME = 'ProductFloatTypeFilterInput';

    public $name = self::NAME;

    public function support(SourceField $sourceField): bool
    {
        return \in_array(
            $sourceField->getType(),
            [
                SourceField\Type::TYPE_FLOAT,
            ], true
        );
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::float(),
                FilterOperator::IN => Type::listOf(Type::float()),
                FilterOperator::GTE => Type::float(),
                FilterOperator::GT => Type::float(),
                FilterOperator::LT => Type::float(),
                FilterOperator::LTE => Type::float(),
                FilterOperator::EXIST => Type::boolean(),
            ],
        ];
    }

    public function validateValueType(string $field, string $operator, mixed $value): void
    {
        $this->validateValueTypeByType($field, $operator, $value, 'float');
    }
}
