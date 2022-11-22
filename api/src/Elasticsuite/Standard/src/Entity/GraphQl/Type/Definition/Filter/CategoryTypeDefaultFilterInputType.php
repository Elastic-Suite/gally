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

class CategoryTypeDefaultFilterInputType extends TextTypeFilterInputType
{
    public const SPECIFIC_NAME = 'CategoryTypeDefaultFilterInputType';

    public $name = self::SPECIFIC_NAME;

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_CATEGORY === $sourceField->getType();
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::nonNull(Type::string()),
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
        return str_replace('.', $this->nestingSeparator, $sourceFieldCode . '.id');
    }

    public function validate(string $argName, mixed $inputData): array
    {
        // No need to validate because the field 'eq' is mandatory in GraphQl schema.
        return [];
    }
}
