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

class TextTypeFilterInputType extends AbstractFilter
{
    public const NAME = 'ProductTextTypeFilterInput';

    public $name = self::NAME;

    public function support(SourceField $sourceField): bool
    {
        return \in_array(
            $sourceField->getType(),
            [
                SourceField\Type::TYPE_TEXT,
                SourceField\Type::TYPE_KEYWORD,
                SourceField\Type::TYPE_BOOLEAN,
                SourceField\Type::TYPE_REFERENCE,
            ], true
        );
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'eq' => Type::string(),
                'in' => Type::listOf(Type::string()),
                'match' => Type::string(),
                'exist' => Type::boolean(),
            ],
        ];
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (\count($inputData) < 1) {
            $errors[] = "Filter argument {$argName}: At least 'eq', 'in', 'match' or 'exist' should be filled.";
        }

        if (\count($inputData) > 1) {
            $errors[] = "Filter argument {$argName}: Only 'eq', 'in', 'match' or 'exist' should be filled.";
        }

        return $errors;
    }
}
