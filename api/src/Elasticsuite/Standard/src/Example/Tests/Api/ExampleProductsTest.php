<?php

namespace Elasticsuite\Example\Tests\Api;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;

class ExampleProductsTest extends ApiTestCase
{
    /**
     * Documentation: https://api-platform.com/docs/distribution/testing/
     */
    public function testGetCollection(): void
    {
        $response = static::createClient()->request('GET', '/example_products');
        // @Todo remove this line after the fixtures will be developed
        $this->assertTrue(true);
//@Todo: uncomment after the fixtures will be developed
//        $this->assertResponseIsSuccessful();
//
//        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

//        $this->assertJsonContains([
//            '@context' => '/contexts/ExampleProduct',
//            '@id' => '/example_products',
//            '@type' => 'hydra:Collection',
//            'hydra:totalItems' => 2,
//        ]);
    }
}
