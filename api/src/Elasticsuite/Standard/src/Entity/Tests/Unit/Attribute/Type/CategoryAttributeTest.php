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
use Elasticsuite\Entity\Model\Attribute\Type\CategoryAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CategoryAttributeTest extends KernelTestCase
{
    public function testInstantiateFailure(): void
    {
        $this->expectException(ArgumentCountError::class);
        $categoryAttribute = $this->getMockBuilder(CategoryAttribute::class)
            ->getMock();
    }

    /**
     * @dataProvider instantiateDataProvider
     *
     * @param string $attributeCode Attribute code
     * @param mixed  $value         Attribute hydration value
     * @param mixed  $expectedValue Expected value with basic structure check
     */
    public function testInstantiate(string $attributeCode, mixed $value, mixed $expectedValue): void
    {
        $reflector = new \ReflectionClass(CategoryAttribute::class);
        $attributeCodeProperty = $reflector->getProperty('attributeCode');
        $valueProperty = $reflector->getProperty('value');

        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $categoryAttribute = $attributeFactory->create(
            CategoryAttribute::ATTRIBUTE_TYPE,
            ['attributeCode' => $attributeCode, 'value' => $value]
        );
        $this->assertEquals($attributeCode, $attributeCodeProperty->getValue($categoryAttribute));
        $this->assertEquals($expectedValue, $valueProperty->getValue($categoryAttribute));
        $this->assertEquals($expectedValue, $categoryAttribute->getValue());
    }

    public function instantiateDataProvider(): array
    {
        return [
            /* ['myCategories', true, true],
            ['myCategories', false, false],
            ['myCategories', null, null],
            ['myCategories', 'myValue', 'myValue'],
            ['myCategories', ['myValue'], ['myValue']], */
            [
                'myCategories',
                [
                    'uid' => 'one',
                    'name' => 'One',
                    'random' => 'Data',
                ],
                [
                    [
                        'uid' => 'one',
                        'name' => 'One',
                        'random' => 'Data',
                    ],
                ],
            ],
            [
                'myCategories',
                [
                    'id' => 'one',
                    'uid' => 'one',
                    'name' => 'One',
                    'is_parent' => true,
                    'is_virtual' => false,
                    'is_blacklisted' => false,
                    'position' => 1,
                ],
                [
                    [
                        'id' => 'one',
                        'uid' => 'one',
                        'name' => 'One',
                        'is_parent' => true,
                        'is_virtual' => false,
                        'is_blacklisted' => false,
                        'position' => 1,
                    ],
                ],
            ],
            [
                'myCategories',
                [
                    [
                        'id' => 'one',
                        'uid' => 'one',
                        'name' => 'One',
                        'is_parent' => true,
                        'is_virtual' => false,
                        'is_blacklisted' => false,
                        'position' => 1,
                    ],
                    [
                        'id' => 'two',
                        'uid' => 'two',
                        'name' => 'Two',
                        'is_parent' => false,
                        'is_virtual' => false,
                        'is_blacklisted' => false,
                    ],
                ],
                [
                    [
                        'id' => 'one',
                        'uid' => 'one',
                        'name' => 'One',
                        'is_parent' => true,
                        'is_virtual' => false,
                        'is_blacklisted' => false,
                        'position' => 1,
                    ],
                    [
                        'id' => 'two',
                        'uid' => 'two',
                        'name' => 'Two',
                        'is_parent' => false,
                        'is_virtual' => false,
                        'is_blacklisted' => false,
                    ],
                ],
            ],
        ];
    }
}
