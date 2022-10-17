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
use Elasticsuite\Entity\Model\Attribute\Type\TextAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TextAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $textAttribute = $this->getMockBuilder(TextAttribute::class)
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
        $reflector = new \ReflectionClass(TextAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $textAttribute = new TextAttribute($attributeCode, $value);
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($textAttribute));
        $this->assertEquals($textAttribute->getValue(), $valueProperty->getValue($textAttribute));
        $this->assertIsNotArray($valueProperty->getValue($textAttribute));
        $this->assertIsNotArray($textAttribute->getValue());

        if ($basicExpectedValue === $extraExpectedValue) {
            $this->assertEquals($basicExpectedValue, $textAttribute->getValue());
        } elseif (!$reflector->hasProperty('extraSanitization')) {
            $this->assertEquals($basicExpectedValue, $textAttribute->getValue());
        } else {
            $expectedValue = $basicExpectedValue;
            if ($reflector->getProperty('extraSanitization')->getValue($textAttribute)) {
                $expectedValue = $extraExpectedValue;
                $this->assertIsString($textAttribute->getValue());
            }
            $this->assertEquals($expectedValue, $textAttribute->getValue());
        }
    }

    public function sanitizationDataProvider(): array
    {
        return [
            // null is invariant.
            /* ['myText', null, null, null],
            // non-scalar is transformed as scalar + null invariant.
            ['myText', [null], null, null],

            ['myText', 'Simple text', 'Simple text', 'Simple text'],
            ['myText', ['Simple text'], 'Simple text', 'Simple text'],
            ['myText', ['First text', 'Second text'], '["First text","Second text"]', '["First text","Second text"]'],

            // deep non-scalar support.
            ['myText', ['a' => ['First text', 'Second text']], '["First text","Second text"]', '["First text","Second text"]'],
            ['myText', ['a' => ['First text', 'Second text'], 'b' => ['Third text', 'Fourth text']], '{"a":["First text","Second text"],"b":["Third text","Fourth text"]}', '{"a":["First text","Second text"],"b":["Third text","Fourth text"]}'],
            ['myText', ['a' => [1, -2], 'b' => [-3, 4]], '{"a":[1,-2],"b":[-3,4]}', '{"a":[1,-2],"b":[-3,4]}'],
            ['myText', ['a' => [1, -2]], '[1,-2]', '[1,-2]'],
            ['myText', ['a' => [-3.0, 4.5], 'b' => [1, -2]], '{"a":[-3,4.5],"b":[1,-2]}', '{"a":[-3,4.5],"b":[1,-2]}'],
            ['myText', ['a' => [-3.7, 4.5], 'b' => [1, -2]], '{"a":[-3.7,4.5],"b":[1,-2]}', '{"a":[-3.7,4.5],"b":[1,-2]}'],
            */
            // extra sanitization prior to API
            ['myText', true, true, '1'],
            ['myText', false, false, ''],

            ['myText', 1.0, 1.0, 1],
            ['myText', -2.0, -2.0, -2],
            ['myText', [1.0], 1.0, 1],
            ['myText', [-2.0, 1.0], '[-2,1]', '[-2,1]'],

            ['myText', '-2.0', '-2.0', '-2.0'],
            ['myText', ['1.0'], '1.0', '1.0'],
            ['myText', ['-2.0', -1.0], '["-2.0",-1]', '["-2.0",-1]'],
            ['myText', ['a' => [1.0, -2.0], 'b' => [-3.0, 4.5]], '{"a":[1,-2],"b":[-3,4.5]}', '{"a":[1,-2],"b":[-3,4.5]}'],
            ['myText', ['a' => [-3.0, 4.5], 'b' => [1.0, -2.0]], '{"a":[-3,4.5],"b":[1,-2]}', '{"a":[-3,4.5],"b":[1,-2]}'],
            ['myText', ['a' => ['1.0', '-2.0'], 'b' => ['-3.0', '4.5']], '{"a":["1.0","-2.0"],"b":["-3.0","4.5"]}', '{"a":["1.0","-2.0"],"b":["-3.0","4.5"]}'],
            ['myText', ['a' => ['-3.0', '4.5'], 'b' => ['1.0', '-2.0']], '{"a":["-3.0","4.5"],"b":["1.0","-2.0"]}', '{"a":["-3.0","4.5"],"b":["1.0","-2.0"]}'],
        ];
    }
}
