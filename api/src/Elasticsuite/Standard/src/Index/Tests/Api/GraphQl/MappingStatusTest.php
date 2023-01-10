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

namespace Elasticsuite\Index\Tests\Api\GraphQl;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class MappingStatusTest extends AbstractTest
{
    /**
     * @dataProvider mappingStatusDataProvider
     */
    public function testGetMappingStatus(User $user, string $entity, array $expectedData)
    {
        $this->loadFixture([
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    { getMappingStatus(entityType: "{$entity}") { status } }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedData) {
                    $this->assertJsonContains($expectedData);
                }
            )
        );
    }

    public function mappingStatusDataProvider(): array
    {
        $admin = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 'product', ['errors' => [['debugMessage' => 'Access Denied.']]]],
            [$admin, 'product', ['data' => ['getMappingStatus' => ['status' => 'green']]]],
            [$admin, 'category', ['data' => ['getMappingStatus' => ['status' => 'red']]]],
            [$admin, 'cms', ['data' => ['getMappingStatus' => null]]],
        ];
    }
}
