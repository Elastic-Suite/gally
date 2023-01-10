<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\GraphQl\Type\Definition;

use Acme\Example\Example\GraphQl\Type\Definition\Filter\ExampleBoolFilterInputType;
use Acme\Example\Example\GraphQl\Type\Definition\Filter\ExampleEqualTypeFilterInputType;
use Acme\Example\Example\GraphQl\Type\Definition\Filter\ExampleRangeFilterInputType;
use GraphQL\Type\Definition\InputObjectType;
use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use GraphQL\Type\Definition\Type;

/**
 * Represents an ExampleFieldFilterCompositeInput type.
 */
class ExampleFieldFilterCompositeInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'ExampleFieldFilterCompositeInput';

    public function __construct(
        private ExampleBoolFilterInputType $exampleBoolFilterInputType,
        private ExampleEqualTypeFilterInputType $exampleEqualTypeFilterInputType,
        private ExampleRangeFilterInputType $exampleRangeFilterInputType,
    )
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return  [
            'description' => 'Field filter 2 input description.',
            'fields' => [
                'boolFilter' => ['type' => $this->exampleBoolFilterInputType, 'description' => 'Bool filter.'],
                'equalFilter' => ['type' => $this->exampleEqualTypeFilterInputType, 'description' => 'Equal filter.'],
                'rangeFilter' => ['type' => $this->exampleRangeFilterInputType, 'description' => 'Range filter.'],
            ]
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }
}
