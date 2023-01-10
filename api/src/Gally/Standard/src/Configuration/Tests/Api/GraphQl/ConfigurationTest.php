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

namespace Gally\Configuration\Tests\Api\GraphQl;

use Gally\Test\AbstractTest;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestGraphQlToTest;
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
