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

namespace Elasticsuite\Configuration\Tests\Api\GraphQl;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ConfigurationTest extends AbstractTest
{
    public function testGetCollection(): void
    {
        $request = new RequestGraphQlToTest(
            <<<GQL
                    {
                      configurations {
                        id
                        value
                      }
                    }
                GQL,
            null
        );

        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) {
                $this->assertJsonContains([
                    'data' => ['configurations' => [['id' => 'base_url/media']]],
                ]);
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }
}
