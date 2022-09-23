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
use GraphQL\Type\Definition\Type;

class IntegerTypeFilterInputType extends AbstractFilter
{
    public const NAME = 'ProductIntegerTypeFilterInput';

    public $name = self::NAME;

    public function support(SourceField $sourceField): bool
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
                'eq' => Type::int(),
                'in' => Type::listOf(Type::int()),
                'gte' => Type::int(),
                'gt' => Type::int(),
                'lt' => Type::int(),
                'lte' => Type::int(),
                'exist' => Type::boolean(),
            ],
        ];
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (empty($inputData)) {
            $errors[] = "Filter argument {$argName}: At least 'eq', 'in', 'gte', 'gt, 'lt', 'lte or 'exist' should be filled.";
        }

        if (isset($inputData['gt']) && isset($inputData['gte'])) {
            $errors[] = "Filter argument {$argName}: Do not use 'gt' and 'gte' in the same filter.";
        }

        if (isset($inputData['lt']) && isset($inputData['lte'])) {
            $errors[] = "Filter argument {$argName}: Do not use 'lt' and 'lte' in the same filter.";
        }

        return $errors;
    }
}
