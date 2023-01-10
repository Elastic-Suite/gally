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

namespace Elasticsuite\GraphQl\Tests\Api\GraphQl;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GraphQlSchemaTest extends AbstractTest
{
    public function testSchemaGeneratedWithErrors(): void
    {
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata_fake.yaml',
        ]);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    query {
                      __schema {
                        types {
                          name
                        }
                      }
                    }
                GQL,
                null,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'errors' => [],
                    ]);
                }
            )
        );
    }

    /**
     * @depends testSchemaGeneratedWithErrors
     */
    public function testSchemaGeneratedWithoutErrors(): void
    {
        self::loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    query {
                      __schema {
                        types {
                          name
                        }
                      }
                    }
                GQL,
                null,
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains([
                        'data' => [
                            '__schema' => [
                                'types' => [],
                            ],
                        ],
                    ]);
                }
            )
        );
    }
}
