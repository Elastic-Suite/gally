<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Entity\Tests\Unit\Attribute\Type;

use ArgumentCountError;
use Elasticsuite\Entity\Model\Attribute\AttributeFactory;
use Elasticsuite\Entity\Model\Attribute\Type\SelectAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class SelectAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $selectAttribute = $this->getMockBuilder(SelectAttribute::class)
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
        $reflector = new \ReflectionClass(SelectAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $selectAttribute = $attributeFactory->create(
            SelectAttribute::ATTRIBUTE_TYPE,
            ['attributeCode' => $attributeCode, 'value' => $value]
        );
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
            // For the moment, select attributes output multiple values so an array stays an array (w/o structure check).
            ['mySelect', ['myValue'], ['myValue']],
            ['mySelect', [['myValue'], ['myOtherValue']], [['myValue'], ['myOtherValue']]],
            ['mySelect', [], []],
            // For the moment, select attributes output multiple values so single entries are forced as array of entries.
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
            // For the moment, no advanced select structure checks.
            [
                'mySelect',
                ['label' => 'Red', 'value' => 'red', 'metadata' => 'value'],
                [['label' => 'Red', 'value' => 'red', 'metadata' => 'value']],
            ],
        ];
    }
}
