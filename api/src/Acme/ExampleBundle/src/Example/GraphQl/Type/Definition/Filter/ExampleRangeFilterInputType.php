<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\GraphQl\Type\Definition\Filter;

use GraphQL\Type\Definition\InputObjectType;
use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use GraphQL\Type\Definition\Type;

/**
 * Represents an ExampleRangeFilterInput type.
 */
class ExampleRangeFilterInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'ExampleRangeFilterInput';

    public function __construct()
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return  [
            'description' => 'Range filter input description.',
            'fields' => [
                'field' => ['type' => Type::nonNull(Type::string()), 'description' => 'Field.'],
                'from' => Type::string(),
                'to' => Type::string(),
            ]
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }
}
