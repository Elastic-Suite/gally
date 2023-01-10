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

class RuleEngineGraphQlFiltersTest extends \Gally\RuleEngine\Tests\Api\Rest\RuleEngineGraphQlFiltersTest
{
    public function testSecurity(): void
    {
        $this->getRuleEngineGraphQlFilters(
            ['type' => 'combination', 'operator' => 'all', 'value' => 'true', 'children' => []],
            null,
            'Access Denied.',
            null
        );
    }

    /**
     * @dataProvider ruleDataProvider
     */
    public function testGet(string $ruleFile): void
    {
        $ruleData = json_decode(file_get_contents(self::BASE_DATA_DIR . $ruleFile), true);
        $this->getRuleEngineGraphQlFilters(
            $ruleData['rule'],
            $ruleData['expectedFilters'] ?? null,
            $ruleData['expectedError'] ?? null,
            $this->getUser(Role::ROLE_CONTRIBUTOR)
        );
    }

    public function getRuleEngineGraphQlFilters(array $rule, ?array $expectedFilters, ?string $expectedError, ?User $user): void
    {
        $rule = addslashes(json_encode($rule, \JSON_PRESERVE_ZERO_FRACTION));

        $request = new RequestGraphQlToTest(
            <<<GQL
                    query {
                        getRuleEngineGraphQlFilters(rule: "{$rule}")
                        {
                          id
                          graphQlFilters
                        }
                    }
                GQL,
            $user,
        );

        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) use ($expectedFilters, $expectedError) {
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
                            'getRuleEngineGraphQlFilters' => [
                                'id' => '/rule_engine_graph_ql_filters/rule_engine_graphql_filters',
                                'graphQlFilters' => $expectedFilters,
                            ],
                        ],
                    ]);
                }
            }
        );
        $this->validateApiCall($request, $expectedResponse);
    }
}
