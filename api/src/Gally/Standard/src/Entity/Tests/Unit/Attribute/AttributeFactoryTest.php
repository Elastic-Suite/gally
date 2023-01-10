<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Entity\Tests\Unit\Attribute;

use Gally\Entity\Model\Attribute\AttributeFactory;
use Gally\Entity\Model\Attribute\AttributeInterface;
use Gally\Entity\Model\Attribute\Type\BooleanAttribute;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class AttributeFactoryTest extends KernelTestCase
{
    /**
     * Test the attribute creation using the factory.
     */
    public function testAttributeCreate(): void
    {
        \assert(static::getContainer()->get(AttributeFactory::class) instanceof AttributeFactory);
        $attributeFactory = static::getContainer()->get(AttributeFactory::class);
        $booleanAttribute = $attributeFactory->create(BooleanAttribute::ATTRIBUTE_TYPE, ['attributeCode' => 'flag', 'value' => '10']);
        $this->assertInstanceOf(AttributeInterface::class, $booleanAttribute);
    }

    /**
     * Test submitting an invalid attribute type throws an exception.
     */
    public function testInvalidAttributeCreate(): void
    {
        \assert(static::getContainer()->get(AttributeFactory::class) instanceof AttributeFactory);
        $attributeFactory = static::getContainer()->get(AttributeFactory::class);

        $this->expectExceptionMessage('No factory found for attribute of type invalidAttributeType');
        $this->expectException(\LogicException::class);
        $attributeFactory->create('invalidAttributeType', []);
    }
}
