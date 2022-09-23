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

class DateTypeFilterInputType extends IntegerTypeFilterInputType
{
    public const NAME = 'ProductDateTypeFilterInput';

    public $name = self::NAME;

    public function support(SourceField $sourceField): bool
    {
        return \in_array(
            $sourceField->getType(),
            [
                SourceField\Type::TYPE_DATE,
            ], true
        );
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'eq' => Type::string(),
                'in' => Type::listOf(Type::string()),
                'gte' => Type::string(),
                'gt' => Type::string(),
                'lt' => Type::string(),
                'lte' => Type::string(),
                'exist' => Type::boolean(),
            ],
        ];
    }
}
