<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Acme\Example\Example\GraphQl\Type\Definition;

use GraphQL\Type\Definition\InputObjectType;
use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use GraphQL\Type\Definition\Type;

/**
 * Represents an ExampleFieldFilterOperatorInput type.
 */
class ExampleFieldFilterOperatorInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'ExampleFieldFilterOperatorInput';

    public function __construct()
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    /**
     * @see https://webonyx.github.io/graphql-php/type-definitions/
     */
    public function getConfig(): array
    {
        return  [
            'description' => 'Field filter input description.',
            'fields' => [
                'field' => ['type' => Type::nonNull(Type::string()), 'description' => 'Field.'],
                'operator' => ['type' => Type::nonNull(Type::string()), 'description' => 'Operator.'],
                'value' => ['type' => Type::nonNull(Type::string()), 'description' => 'Value.'],
                '_must' => fn() => Type::listOf($this),
                '_should' => fn() => Type::listOf($this),
                '_not' => fn() => Type::listOf($this),
            ]
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }
}
