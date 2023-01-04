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
use Elasticsuite\Entity\Model\Attribute\AttributeFactory;
use Elasticsuite\Entity\Model\Attribute\Type\PriceAttribute;
use Elasticsuite\Entity\Service\PriceGroupProvider;
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
    public function testStructureCheck(string $attributeCode, mixed $value, mixed $expectedValue, string $priceGroupId = '0'): void
    {
        $priceGroupProvider = $this->getMockBuilder(PriceGroupProvider::class)->disableOriginalConstructor()->getMock();
        $priceGroupProvider->method('getCurrentPriceGroupId')->willReturn($priceGroupId);

        $reflector = new \ReflectionClass(PriceAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $priceAttribute = $attributeFactory->create(
            PriceAttribute::ATTRIBUTE_TYPE,
            ['attributeCode' => $attributeCode, 'value' => $value, 'priceGroupProvider' => $priceGroupProvider]
        );
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($priceAttribute));
        $this->assertEquals($expectedValue, $valueProperty->getValue($priceAttribute));
        $this->assertEquals($expectedValue, $priceAttribute->getValue());
    }

    public function structureCheckDataProvider(): array
    {
        return [
            /*
             * The price attribute value should be an array of prices (['price' => 13.50, 'group_id' => 0, ...], ['price' => 16, 'group_id' => 1, ...]], ...) and each price should have a group_id,
             * if these rules are not respected the price output will be an empty array.
             */
            ['myPrice', null, []],
            ['myPrice', true, []],
            ['myPrice', false, []],
            ['myPrice', 1, []],
            ['myPrice', -3.5, []],
            ['myPrice', 'myValue', []],
            ['myPrice', ['myValue'], []],
            ['myPrice', [['myValue'], ['myOtherValue']], []],
            ['myPrice', [], []],
            [
                'myPrice',
                [['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0]],
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
                ],
            ],
            [
                'myPrice',
                [
                    ['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0],
                    ['original_price' => 13.50, 'price' => 10.50, 'is_discounted' => true, 'group_id' => 1],
                ],
                [
                    ['original_price' => 13.50, 'price' => 10.50, 'is_discounted' => true, 'group_id' => 1],
                ],
                '1',
            ],
            [
                'myPrice',
                [
                    ['original_price' => 13.50, 'price' => 13.50, 'is_discounted' => false, 'group_id' => 0],
                    ['original_price' => 13.50, 'price' => 10.50, 'is_discounted' => true, 'group_id' => 1],
                ],
                [],
                'fake_group_id',
            ],
            [
                'myPrice',
                ['original_price' => 13.50, 'price' => 13.50, 'another' => 'field'],
                [],
            ],
            [
                'myPrice',
                ['original_price' => 13.50, 'price' => 13.50, 'another' => 'field', 'group_id' => 0],
                [],
            ],
        ];
    }
}
