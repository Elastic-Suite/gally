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

namespace Elasticsuite\Hydra\Tests\Api\Rest;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;

class DocumentationTest extends ApiTestCase
{
    public function testAdditionalHydraDocumentation(): void
    {
        $response = static::createClient()->request('GET', '/docs.jsonld');
        $this->assertResponseIsSuccessful();

        $response = json_decode($response->getContent(), true);

        $classKey = array_search('SourceField', array_column($response['hydra:supportedClass'] ?? [], 'hydra:title'), true);
        $this->assertNotFalse($classKey, "Class 'SourceField' is missing in 'hydra:supportedClass' node in docs.jsonld.");

        $propertyCodeKey = array_search('code', array_column($response['hydra:supportedClass'][$classKey]['hydra:supportedProperty'] ?? [], 'hydra:title'), true);
        $this->assertNotFalse($propertyCodeKey, "Property 'code' for the class 'SourceField' is missing in docs.jsonld.");

        static::assertArraySubset(
            [
                'hydra:title' => 'code',
                'hydra:property' => [
                    '@id' => '#SourceField/code',
                    'rdfs:label' => 'Attribute code',
                    'showable' => 'false',
                ],
            ],
            $response['hydra:supportedClass'][$classKey]['hydra:supportedProperty'][$propertyCodeKey]
        );

        $propertyWeightKey = array_search('weight', array_column($response['hydra:supportedClass'][$classKey]['hydra:supportedProperty'] ?? [], 'hydra:title'), true);
        $this->assertArrayNotHasKey(
            'showable',
            $response['hydra:supportedClass'][$classKey]['hydra:supportedProperty'][$propertyWeightKey]['hydra:property'],
            "'showable' key should not exist when it is not explicitly defined."
        );
    }
}
