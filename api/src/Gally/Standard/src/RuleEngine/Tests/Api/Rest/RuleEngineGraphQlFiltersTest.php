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

namespace Gally\RuleEngine\Tests\Api\Rest;

use Gally\Test\AbstractTest;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestToTest;
use Gally\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class RuleEngineGraphQlFiltersTest extends AbstractTest
{
    protected const BASE_DATA_DIR = __DIR__ . '/../Data/';

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
    }

    protected function getApiPath(): string
    {
        return '/rule_engine_graphql_filters';
    }

    public function testSecurity(): void
    {
        $this->validateApiCall(
            new RequestToTest('POST', $this->getApiPath(), null),
            new ExpectedResponse(401)
        );
    }

    /**
     * @dataProvider ruleDataProvider
     */
    public function testGet(string $ruleFile): void
    {
        $ruleData = json_decode(file_get_contents(self::BASE_DATA_DIR . $ruleFile), true);
        $request = new RequestToTest('POST', $this->getApiPath(), $this->getUser(Role::ROLE_CONTRIBUTOR), ['rule' => json_encode($ruleData['rule'], \JSON_PRESERVE_ZERO_FRACTION)]);
        $expectedResponse = new ExpectedResponse(
            $ruleData['responseCode'],
            function (ResponseInterface $response) use ($ruleData) {
                $this->assertJsonContains(
                    [
                        '@context' => '/contexts/RuleEngineGraphQlFilters',
                        '@id' => '/rule_engine_graph_ql_filters/rule_engine_graphql_filters',
                        '@type' => 'RuleEngineGraphQlFilters',
                        'id' => 'rule_engine_graphql_filters',
                        'graphQlFilters' => $ruleData['expectedFilters'],
                    ],
                );
            },
            $ruleData['expectedError'] ?? ''
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    public function ruleDataProvider(): array
    {
        $rules = array_merge(
            glob(self::BASE_DATA_DIR . 'Success/*.json'),
            glob(self::BASE_DATA_DIR . 'Error/*.json'),
        );

        //We remove self::BASE_DATA_DIR from path to see the file name in the error output otherwise it is truncated.
        return array_map(fn ($rule) => [str_replace(self::BASE_DATA_DIR, '', $rule)], $rules);
    }
}
