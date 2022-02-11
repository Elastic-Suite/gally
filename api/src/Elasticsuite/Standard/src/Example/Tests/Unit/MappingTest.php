<?php

namespace Elasticsuite\Example\Tests\Unit;

use Elasticsuite\Example\Service\Dummy;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MappingTest extends KernelTestCase
{
    /**
     * Symfony documentation : https://symfony.com/doc/current/testing.html#unit-tests
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
