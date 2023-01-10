<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Entity\GraphQl\Type\Definition\Filter;

use Gally\Metadata\Model\SourceField;
use Gally\Search\Constant\FilterOperator;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
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
    public function getFilterFieldName(string $sourceFieldCode): string
    {
        return $sourceFieldCode . '.id';
    }

    public function validate(string $argName, mixed $inputData, ContainerConfigurationInterface $containerConfig): array
    {
        // No need to validate because the field 'eq' is mandatory in GraphQl schema.
        return [];
    }
}
