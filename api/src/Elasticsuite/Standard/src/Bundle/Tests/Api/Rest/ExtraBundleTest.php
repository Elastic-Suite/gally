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

namespace Elasticsuite\Bundle\Tests\Api\Rest;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ExtraBundleTest extends AbstractTest
{
    public function testGetCollection(): void
    {
        $request = new RequestToTest('GET', '/extra_bundles', null);
        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) {
                $this->assertJsonContains([
                    '@context' => '/contexts/ExtraBundle',
                    '@id' => '/extra_bundles',
                    '@type' => 'hydra:Collection',
                    'hydra:member' => [],
                ]);
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }
}
