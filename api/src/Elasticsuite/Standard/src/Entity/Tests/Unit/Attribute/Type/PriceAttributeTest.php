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

namespace Elasticsuite\Entity\Tests\Unit\Attribute\Type;

use ArgumentCountError;
use Elasticsuite\Entity\Model\Attribute\Type\PriceAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PriceAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $priceAttribute = $this->getMockBuilder(PriceAttribute::class)
            ->getMock();
    }

    /**
     * @dataProvider structureCheckDataProvider
     *
     * @param string $attributeCode Attribute code
     * @param mixed  $value         Attribute hydration value
     * @param mixed  $expectedValue Expected value with basic structure check
     */
    public function testStructureCheck(string $attributeCode, mixed $value, mixed $expectedValue): void
    {
        $reflector = new \ReflectionClass(PriceAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $priceAttribute = new PriceAttribute($attributeCode, $value);
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($priceAttribute));
        $this->assertEquals($expectedValue, $valueProperty->getValue($priceAttribute));
        $this->assertEquals($expectedValue, $priceAttribute->getValue());
    }

    public function structureCheckDataProvider(): array
    {
        return [
            ['myPrice', null, null],
            ['myPrice', true, true],
            ['myPrice', false, false],
            ['myPrice', 1, 1],
            ['myPrice', -3.5, -3.5],
            ['myPrice', 'myValue', 'myValue'],
            // For the moment, price attributes output multiple values so an array stays an array (w/o structure check).
            ['myPrice', ['myValue'], ['myValue']],
            ['myPrice', [['myValue'], ['myOtherValue']], [['myValue'], ['myOtherValue']]],
            ['myPrice', [], []],
            // For the moment, price attributes output multiple values so single entries are forced as array of entries.
            [
                'myPrice',
                ['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0],
                [['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0]],
            ],
            [
                'myPrice',
                [
                    ['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0],
                    ['original_price' => 13.50, 'price' => 10.50, 'is_discounted' => true, 'group_id' => 1],
                ],
                [
                    ['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0],
                    ['original_price' => 13.50, 'price' => 10.50, 'is_discounted' => true, 'group_id' => 1],
                ],
            ],
            // For the moment, no advanced price structure checks.
            [
                'myPrice',
                ['original_price' => 13.50, 'price' => 13.50, 'another' => 'field'],
                [['original_price' => 13.50, 'price' => 13.50, 'another' => 'field']],
            ],
        ];
    }
}
