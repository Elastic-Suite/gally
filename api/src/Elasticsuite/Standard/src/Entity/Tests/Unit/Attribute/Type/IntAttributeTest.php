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
use Elasticsuite\Entity\Model\Attribute\Type\IntAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class IntAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $integerAttribute = $this->getMockBuilder(IntAttribute::class)
            ->getMock();
    }

    /**
     * @dataProvider sanitizationDataProvider
     *
     * @param string $attributeCode      Attribute code
     * @param mixed  $value              Attribute hydration value
     * @param mixed  $basicExpectedValue Expected value with basic sanitization
     * @param mixed  $extraExpectedValue Expected value with advanced sanitization
     */
    public function testSanitization(string $attributeCode, mixed $value, mixed $basicExpectedValue, mixed $extraExpectedValue): void
    {
        $reflector = new \ReflectionClass(IntAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $integerAttribute = $attributeFactory->create(
            IntAttribute::ATTRIBUTE_TYPE,
            ['attributeCode' => $attributeCode, 'value' => $value]
        );
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($integerAttribute));
        $this->assertEquals($integerAttribute->getValue(), $valueProperty->getValue($integerAttribute));
        $this->assertIsNotArray($valueProperty->getValue($integerAttribute));
        $this->assertIsNotArray($integerAttribute->getValue());

        if ($basicExpectedValue === $extraExpectedValue) {
            $this->assertEquals($basicExpectedValue, $integerAttribute->getValue());
        } elseif (!$reflector->hasProperty('extraSanitization')) {
            $this->assertEquals($basicExpectedValue, $integerAttribute->getValue());
        } else {
            $expectedValue = $basicExpectedValue;
            if ($reflector->getProperty('extraSanitization')->getValue($integerAttribute)) {
                $expectedValue = $extraExpectedValue;
                $this->assertIsInt($integerAttribute->getValue());
            }
            $this->assertEquals($expectedValue, $integerAttribute->getValue());
        }
    }

    public function sanitizationDataProvider(): array
    {
        return [
            // null is invariant.
            ['myInteger', null, null, null],
            // non-scalar is transformed as scalar + null invariant.
            ['myInteger', [null], null, null],

            ['myInteger', 1, 1, 1],
            ['myInteger', -2, -2, -2],
            ['myInteger', [1], 1, 1],
            ['myInteger', [-2, 1], -2, -2],

            // deep non-scalar support
            ['myInteger', ['a' => [1, -2], 'b' => [-3, 4]], 1, 1],
            ['myInteger', ['a' => [-3, 4.5], 'b' => [1, -2]], -3, -3],
            /*
             * extra sanitization prior to API
             * -----
             */
            ['myInteger', true, true, 1],
            ['myInteger', false, false, 0],
            ['myInteger', 'myValue', 'myValue', 0],
            ['myInteger', ['myValue'], 'myValue', 0],

            ['myInteger', 1.0, 1.0, 1],
            ['myInteger', -2.0, -2.0, -2],
            ['myInteger', [1.0], 1.0, 1],
            ['myInteger', [-2.0, 1.0], -2.0, -2],

            ['myInteger', '-2.0', '-2.0', -2],
            ['myInteger', ['1.0'], '1.0', 1],
            ['myInteger', ['-2.0', -1.0], '-2.0', -2],
            ['myInteger', ['a' => [1.0, -2.0], 'b' => [-3.0, 4.5]], 1.0, 1],
            ['myInteger', ['a' => [-3.0, 4.5], 'b' => [1.0, -2.0]], -3.0, -3],
            ['myInteger', ['a' => ['1.0', '-2.0'], 'b' => ['-3.0', '4.5']], '1.0', 1],
            ['myInteger', ['a' => ['-3.0', '4.5'], 'b' => ['1.0', '-2.0']], '-3.0', -3],
        ];
    }
}
