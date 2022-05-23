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

use GraphQL\Error\Error;
use GraphQL\Type\Definition\ScalarType;
use GraphQL\Utils\Utils;
use GraphQL\Type\Definition\InputObjectType;
use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use GraphQL\Type\Definition\Type;

/**
 * Represents an InputProduct type.
 */
class ExampleFieldFilterInputType extends InputObjectType implements TypeInterface
{
    public function __construct()
    {
        $this->name = 'ExampleFieldFilterInput';

        parent::__construct($this->getConfig());
    }

    /**
     * @see https://webonyx.github.io/graphql-php/type-definitions/
     */
    public function getConfig() {
        return  [
            'description' => 'Field filter input description.',
            'fields' => [
                'field' => ['type' => Type::nonNull(Type::string()), 'description' => 'Field.'],
                'operator' => ['type' => Type::nonNull(Type::string()), 'description' => 'Operator.'],
                'value' => ['type' => Type::nonNull(Type::string()), 'description' => 'Value.'],
            ]
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }
}
