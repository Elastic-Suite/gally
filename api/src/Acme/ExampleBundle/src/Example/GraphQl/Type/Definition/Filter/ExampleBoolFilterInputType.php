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

use Acme\Example\Example\GraphQl\Type\Definition\ExampleFieldFilterCompositeInputType;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use GraphQL\Type\Definition\InputObjectType;
use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use GraphQL\Type\Definition\Type;

/**
 * Represents an ExampleBoolFilterInput type.
 */
class ExampleBoolFilterInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'ExampleBoolFilterInput';

    public function __construct(
        private TypesContainerInterface $typesContainer,
    )
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return  [
            'description' => 'Bool filter input description.',
            'fields' => [
                '_must' => fn() => $this->typesContainer->get(ExampleFieldFilterCompositeInputType::NAME),
                '_should' => fn() => $this->typesContainer->get(ExampleFieldFilterCompositeInputType::NAME),
                '_not' => fn() => $this->typesContainer->get(ExampleFieldFilterCompositeInputType::NAME),
            ]
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }
}
