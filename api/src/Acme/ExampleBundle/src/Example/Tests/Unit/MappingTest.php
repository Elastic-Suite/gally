<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Acme\Example\Example\Tests\Unit;

use Acme\Example\Example\Service\Dummy;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MappingTest extends KernelTestCase
{
    /**
     * Symfony documentation : https://symfony.com/doc/current/testing.html#unit-tests.
     */
    public function testMapping()
    {
        self::bootKernel();
        $container = static::getContainer();
        /** @var Dummy $dummyService */
        $dummyService = $container->get(Dummy::class);
        $mapping = $dummyService->getMapping();

        $this->assertArrayHasKey('attributes', $mapping);
    }

    public function testMappingMandatoryAttributeSku()
    {
        self::bootKernel();
        $container = static::getContainer();
        /** @var Dummy $dummyService */
        $dummyService = $container->get(Dummy::class);
        $mapping = $dummyService->getMapping();
        $this->assertArrayHasKey('sku', $mapping['attributes']);
    }
}
