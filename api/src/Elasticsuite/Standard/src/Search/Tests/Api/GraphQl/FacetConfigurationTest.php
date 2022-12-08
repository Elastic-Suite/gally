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

namespace Elasticsuite\Search\Tests\Api\GraphQl;

use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Tests\Api\Rest\FacetConfigurationTest as RestFacetConfigurationTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class FacetConfigurationTest extends RestFacetConfigurationTest
{
    /**
     * @dataProvider updateDataProvider
     * @depends testGetCollectionBefore
     */
    public function testUpdateValue(User $user, string $id, array $newData, int $expectedStatus, ?string $expectedMessage)
    {
        $query = '';
        foreach ($newData as $key => $value) {
            $query .= "\n$key: " . (\is_string($value) ? "\"$value\"" : $value);
        }

        $expectedResponse = 200 != $expectedStatus
            ? new ExpectedResponse(200, function (ResponseInterface $response) use ($expectedMessage) {
                $this->assertJsonContains(['errors' => [['debugMessage' => $expectedMessage]]]);
            })
            : new ExpectedResponse(200);

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    mutation {
                      updateFacetConfiguration(input: {
                        id: "{$this->getApiPath()}/$id" $query
                      }) {
                        facetConfiguration { id coverageRate sortOrder }
                      }
                    }
                GQL,
                $user
            ),
            $expectedResponse
        );
    }

    protected function testGetCollection(?string $entityType, ?string $categoryId, array $items): void
    {
        $query = $entityType ? ["sourceField__metadata__entity: \"$entityType\""] : [];

        if ($categoryId) {
            $query[] = "category: \"/categories/$categoryId\"";
        }
        $query = empty($query) ? '' : ('(' . implode(' ', $query) . ')');
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                      facetConfigurations $query {
                        collection {
                            id
                            displayMode
                            coverageRate
                            maxSize
                            isVirtual
                            sortOrder
                            defaultCoverageRate
                            defaultMaxSize
                            defaultSortOrder
                            category { id }
                            sourceField { id }
                            sourceFieldCode
                        }
                        paginationInfo {totalCount}
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR)
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($items) {
                    $this->assertJsonContains(
                        [
                            'data' => [
                                'facetConfigurations' => [
                                    'paginationInfo' => ['totalCount' => \count($items)],
                                ],
                            ],
                        ]
                    );

                    $responseData = $response->toArray();

                    foreach ($items as $item) {
                        $item = $this->completeContent($item);
                        $this->assertEquals(
                            $item,
                            $this->getById($item['id'], $responseData['data']['facetConfigurations']['collection'])
                        );
                    }
                }
            )
        );
    }

    protected function completeContent(array $data): array
    {
        $sourceFieldId = $data['sourceField'];
        $categoryId = $data['category'] ?? 0;
        unset($data['sourceField']);
        unset($data['category']);
        $id = implode('-', [$sourceFieldId, $categoryId]);

        $baseData = [
            'id' => "/facet_configurations/$id",
            'sourceField' => [
                'id' => "/source_fields/$sourceFieldId",
            ],
            'category' => null,
            'displayMode' => 'auto',
            'coverageRate' => 90,
            'maxSize' => 10,
            'isVirtual' => false,
            'sortOrder' => BucketInterface::SORT_ORDER_COUNT,
            'defaultCoverageRate' => 90,
            'defaultMaxSize' => 10,
            'defaultSortOrder' => BucketInterface::SORT_ORDER_COUNT,
        ];

        if ($categoryId) {
            $baseData['category'] = [
                'id' => "/categories/$categoryId",
            ];
        }

        return array_merge($baseData, $data);
    }

    protected function getById(string $id, array $list): ?array
    {
        foreach ($list as $element) {
            if ($id === $element['id']) {
                return $element;
            }
        }

        return null;
    }
}
