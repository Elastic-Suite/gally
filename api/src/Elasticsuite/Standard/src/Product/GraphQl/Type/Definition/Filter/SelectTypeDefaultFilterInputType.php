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

class SelectTypeDefaultFilterInputType extends TextTypeFilterInputType
{
    public const SPECIFIC_NAME = 'SelectTypeDefaultFilterInputType';

    public $name = self::SPECIFIC_NAME;

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_SELECT === $sourceField->getType();
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::string(),
                FilterOperator::IN => Type::listOf(Type::string()),
                FilterOperator::EXIST => Type::boolean(),
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getGraphQlFieldName(string $sourceFieldCode): string
    {
        /*
         * No complementarity between getGraphQlFieldName and getMappingFieldName for complex types.
         * getGraphQlFieldName(A) != getGraphQlFieldName(getMappingFieldName(getGraphQlFieldName(A))
         */
        return str_replace('.', $this->nestingSeparator, $sourceFieldCode . '.value');
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (\count($inputData) < 1) {
            $errors[] = sprintf(
                "Filter argument %s: At least '%s', '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::IN,
                FilterOperator::EXIST,
            );
        }

        if (\count($inputData) > 1) {
            $errors[] = sprintf(
                "Filter argument %s: Only '%s', '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::IN,
                FilterOperator::EXIST,
            );
        }

        return $errors;
    }
}
