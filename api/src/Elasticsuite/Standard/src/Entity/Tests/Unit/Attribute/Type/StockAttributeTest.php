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
use Elasticsuite\Entity\Model\Attribute\Type\StockAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class StockAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $stockAttribute = $this->getMockBuilder(StockAttribute::class)
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
        $reflector = new \ReflectionClass(StockAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $stockAttribute = new StockAttribute($attributeCode, $value);
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($stockAttribute));
        $this->assertEquals($expectedValue, $valueProperty->getValue($stockAttribute));
        $this->assertEquals($expectedValue, $stockAttribute->getValue());
    }

    public function structureCheckDataProvider(): array
    {
        return [
            ['myStock', null, null],
            ['myStock', true, true],
            ['myStock', false, false],
            ['myStock', 1, 1],
            ['myStock', -3.5, -3.5],
            ['myStock', 'myValue', 'myValue'],
            // For the moment, stock attributes output a single value/object (w/o structure check).
            ['myStock', ['myValue'], 'myValue'],
            ['myStock', [['myValue'], ['myOtherValue']], ['myValue']],
            ['myStock', [], []],
            // For the moment, select attributes output multiple values so single entries are forced as array of entries.
            [
                'myStock',
                ['qty' => 11, 'status' => true],
                ['qty' => 11, 'status' => true],
            ],
            [
                'myStock',
                [['qty' => 11, 'status' => true]],
                ['qty' => 11, 'status' => true],
            ],
            // For the moment, no advanced select structure checks.
            [
                'myStock',
                [['qty' => 11, 'status' => true, 'stock_id' => 0], ['qty' => 0, 'status' => false, 'stock_id' => 1]],
                ['qty' => 11, 'status' => true, 'stock_id' => 0],
            ],
        ];
    }
}
