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

namespace Gally\Bundle\Tests\Api\GraphQl;

use Gally\Test\AbstractTest;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestGraphQlToTest;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ExtraBundleTest extends AbstractTest
{
    public function testGetCollection(): void
    {
        $request = new RequestGraphQlToTest(
            <<<GQL
                    {
                      extraBundles {
                        name
                      }
                    }
                GQL,
            null
        );

        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) {
                $this->assertJsonContains([
                    'data' => ['extraBundles' => []],
                ]);
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }
}
