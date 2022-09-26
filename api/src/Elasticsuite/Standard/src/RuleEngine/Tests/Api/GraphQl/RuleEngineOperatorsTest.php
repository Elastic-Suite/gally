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

namespace Elasticsuite\RuleEngine\Tests\Api\GraphQl;

use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class RuleEngineOperatorsTest extends \Elasticsuite\RuleEngine\Tests\Api\Rest\RuleEngineOperatorsTest
{
    public function testSecurity(): void
    {
        $this->getRuleEngineOperators(null, 'Access Denied.');
    }

    public function testGetCollection(): void
    {
        $this->getRuleEngineOperators($this->getUser(Role::ROLE_CONTRIBUTOR));
    }

    public function getRuleEngineOperators(?User $user, ?string $expectedError = null): void
    {
        $request = new RequestGraphQlToTest(
            <<<GQL
                    query {
                        getRuleEngineOperators
                        {
                            id
                            operators
                            operatorsBySourceFieldType
                            operatorsValueType
                        }
                    }
                GQL,
            $user,
        );

        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) use ($expectedError) {
                if (null !== $expectedError) {
                    $this->assertJsonContains([
                        'errors' => [
                            [
                                'debugMessage' => $expectedError,
                            ],
                        ],
                    ]);
                } else {
                    $this->assertJsonContains([
                        'data' => [
                            'getRuleEngineOperators' => [
                                'id' => '/rule_engine_operators?id=rule_engine_operators',
                                'operators' => [],
                                'operatorsBySourceFieldType' => [],
                                'operatorsValueType' => [],
                            ],
                        ],
                    ]);

                    $this->checkResponseData($response->toArray()['data']['getRuleEngineOperators']);
                }
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }
}
