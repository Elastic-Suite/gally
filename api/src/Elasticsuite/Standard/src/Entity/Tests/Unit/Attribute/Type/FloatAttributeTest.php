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
use Elasticsuite\Entity\Model\Attribute\Type\FloatAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class FloatAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $floatAttribute = $this->getMockBuilder(FloatAttribute::class)
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
        $reflector = new \ReflectionClass(FloatAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $floatAttribute = $attributeFactory->create(
            FloatAttribute::ATTRIBUTE_TYPE,
            ['attributeCode' => $attributeCode, 'value' => $value]
        );
        $this->assertEquals($floatAttribute->getValue(), $valueProperty->getValue($floatAttribute));
        $this->assertIsNotArray($valueProperty->getValue($floatAttribute));
        $this->assertIsNotArray($floatAttribute->getValue());

        if ($basicExpectedValue === $extraExpectedValue) {
            $this->assertEquals($basicExpectedValue, $floatAttribute->getValue());
        } elseif (!$reflector->hasProperty('extraSanitization')) {
            $this->assertEquals($basicExpectedValue, $floatAttribute->getValue());
        } else {
            $expectedValue = $basicExpectedValue;
            if ($reflector->getProperty('extraSanitization')->getValue($floatAttribute)) {
                $expectedValue = $extraExpectedValue;
            }
            $this->assertEquals($expectedValue, $floatAttribute->getValue());
        }
    }

    public function sanitizationDataProvider(): array
    {
        return [
            // null is invariant.
            ['myFloat', null, null, null],
            // non-scalar is transformed as scalar + null invariant.
            ['myFloat', [null], null, null],

            ['myFloat', 1.0, 1.0, 1.0],
            ['myFloat', -2.0, -2.0, -2.0],
            ['myFloat', [1.0], 1.0, 1.0],
            ['myFloat', [-2.0, 1.0], -2.0, -2.0],

            // deep non-scalar support
            ['myFloat', ['a' => [1.0, -2.0], 'b' => [-3.0, 4.5]], 1.0, 1.0],
            ['myFloat', ['a' => [-3.0, 4.5], 'b' => [1.0, -2.0]], -3.0, -3.0],

            // extra sanitization variations.
            ['myFloat', true, true, 1.0],
            ['myFloat', false, false, 0.0],
            ['myFloat', '-2', '-2', -2.0],
            ['myFloat', ['1'], '1', 1.0],
            ['myFloat', ['-2', '-1'], '-2', -2.0],
            ['myFloat', ['a' => ['1', '-2'], 'b' => ['-3', '4']], '1', 1.0],
            ['myFloat', ['a' => ['-3', '4'], 'b' => ['1', '-2']], '-3', -3.0],
        ];
    }
}
