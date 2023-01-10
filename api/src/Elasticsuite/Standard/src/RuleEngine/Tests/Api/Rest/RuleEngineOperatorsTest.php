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

namespace Elasticsuite\RuleEngine\Tests\Api\Rest;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class RuleEngineOperatorsTest extends AbstractTest
{
    protected function getApiPath(): string
    {
        return '/rule_engine_operators';
    }

    public function testSecurity(): void
    {
        $this->validateApiCall(
            new RequestToTest('GET', $this->getApiPath(), null),
            new ExpectedResponse(401)
        );
    }

    public function testGetCollection(): void
    {
        $request = new RequestToTest('GET', $this->getApiPath(), $this->getUser(Role::ROLE_CONTRIBUTOR));
        $expectedResponse = new ExpectedResponse(
            200,
            function (ResponseInterface $response) {
                $this->assertJsonContains(
                    [
                        '@context' => '/contexts/RuleEngineOperators',
                        '@id' => '/rule_engine_operators?id=rule_engine_operators',
                        '@type' => 'RuleEngineOperators',
                        'id' => 'rule_engine_operators',
                        'operators' => [],
                        'operatorsBySourceFieldType' => [],
                        'operatorsValueType' => [],
                    ],
                );

                $this->checkResponseData($response->toArray());
            }
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    protected function checkResponseData(array $responseArray)
    {
        $this->assertGreaterThanOrEqual(11, \count($responseArray['operators']));
        $this->assertGreaterThanOrEqual(7, \count($responseArray['operatorsBySourceFieldType']));
        $this->assertGreaterThanOrEqual(7, \count($responseArray['operatorsValueType']));
    }
}
