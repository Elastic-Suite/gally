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

namespace Elasticsuite\Test;

use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

/**
 * @codeCoverageIgnore
 */
abstract class AbstractEntityTestWithUpdate extends AbstractEntityTest
{
    /**
     * @dataProvider updateDataProvider
     */
    public function testUpdate(
        User $user,
        int|string $id,
        array $data,
        int $responseCode = 200,
        ?string $message = null,
        string $validRegex = null
    ): void {
        $request = new RequestToTest('PUT', "{$this->getApiPath()}/{$id}", $user, $data);
        $expectedResponse = new ExpectedResponse(
            $responseCode,
            function (ResponseInterface $response) use ($data, $validRegex) {
                $shortName = $this->getShortName();
                $this->assertJsonContains(
                    array_merge(
                        ['@context' => "/contexts/$shortName", '@type' => $shortName],
                        $this->getJsonUpdateValidation($data)
                    )
                );
                $this->assertMatchesRegularExpression($validRegex ?? '~^' . $this->getApiPath() . '/\d+$~', $response->toArray()['@id']);
                $this->assertMatchesResourceItemJsonSchema($this->getEntityClass());
            },
            $message
        );

        $this->validateApiCall($request, $expectedResponse);
    }

    /**
     * Data provider for entity update api call
     * The data provider should return test case with :
     * - User $user: user to use in the api call
     * - int|string $id: id of the entity to update
     * - array $data: post data
     * - (optional) int $responseCode: expected response code
     * - (optional) string $message: expected error message
     * - (optional) string $validRegex: a regexp used to validate generated id.
     */
    abstract public function updateDataProvider(): iterable;

    protected function getJsonUpdateValidation(array $expectedData): array
    {
        return $expectedData;
    }
}
