<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Cache\Tests\Api\Rest;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ProxyCacheTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
        ]);
    }

    public function testProxyCacheHeaders(): void
    {
        $this->validateApiCall(
            new RequestToTest('GET', 'categoryTree', $this->getUser(Role::ROLE_ADMIN)),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $headerExpectedValues = [
                        'cache-tags' => '/categories,/category_configurations',
                        'cache-control' => 'must-revalidate',
                    ];
                    $this->validateHeaders($response, $headerExpectedValues);
                }
            )
        );
    }

    protected function validateHeaders(ResponseInterface $response, array $headerExpectedValues)
    {
        $headers = $response->getHeaders();

        foreach (array_keys($headerExpectedValues) as $headerName) {
            $this->assertArrayHasKey($headerName, $headers);
        }

        foreach ($headerExpectedValues as $headerName => $expectedValue) {
            $valueFound = false;
            foreach ($headers[$headerName] as $value) {
                if (str_contains($value, $expectedValue)) {
                    $valueFound = true;
                    break;
                }
            }

            $this->assertTrue($valueFound, "Value '$expectedValue' not found in the header '$headerName'");
        }
    }
}
