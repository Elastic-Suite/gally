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

namespace Elasticsuite\Entity\Tests\Unit\Attribute;

use Elasticsuite\Entity\Model\Attribute\AttributeFactory;
use Elasticsuite\Entity\Model\Attribute\AttributeInterface;
use Elasticsuite\Entity\Model\Attribute\Type\BooleanAttribute;
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
