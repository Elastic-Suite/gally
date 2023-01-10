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

namespace Gally\RuleEngine\Tests\Api\GraphQl;

use Gally\Test\ExpectedResponse;
use Gally\Test\RequestGraphQlToTest;
use Gally\User\Constant\Role;
use Gally\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class RuleEngineOperatorsTest extends \Gally\RuleEngine\Tests\Api\Rest\RuleEngineOperatorsTest
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
