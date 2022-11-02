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
use Elasticsuite\Entity\Model\Attribute\Type\MultiSelectAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MultiSelectAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $muliSelectAttribute = $this->getMockBuilder(MultiSelectAttribute::class)
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
        $reflector = new \ReflectionClass(MultiSelectAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $selectAttribute = new MultiSelectAttribute($attributeCode, $value);
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($selectAttribute));
        $this->assertEquals($expectedValue, $valueProperty->getValue($selectAttribute));
        $this->assertEquals($expectedValue, $selectAttribute->getValue());
    }

    public function structureCheckDataProvider(): array
    {
        return [
            ['mySelect', null, null],
            ['mySelect', true, true],
            ['mySelect', false, false],
            ['mySelect', 1, 1],
            ['mySelect', -3.5, -3.5],
            ['mySelect', 'myValue', 'myValue'],
            // Multiselect attributes are expected to output multiple values so an array stays an array (w/o structure check).
            ['mySelect', ['myValue'], ['myValue']],
            ['mySelect', [['myValue'], ['myOtherValue']], [['myValue'], ['myOtherValue']]],
            ['mySelect', [], []],
            // Multiselect attributes are expected to output multiple values so single entries are forced as array of entries.
            [
                'mySelect',
                ['label' => 'Red', 'value' => 'red'],
                [['label' => 'Red', 'value' => 'red']],
            ],
            [
                'mySelect',
                [['label' => 'Red', 'value' => 'red'], ['label' => 'Green', 'value' => 'green']],
                [['label' => 'Red', 'value' => 'red'], ['label' => 'Green', 'value' => 'green']],
            ],
            // For the moment, no advanced multiselect structure checks.
            [
                'mySelect',
                ['label' => 'Red', 'value' => 'red', 'metadata' => 'value'],
                [['label' => 'Red', 'value' => 'red', 'metadata' => 'value']],
            ],
        ];
    }
}
