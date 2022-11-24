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

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class ViewMoreFacetTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/facet_configuration.yaml',
            __DIR__ . '/../../fixtures/source_field_option_label.yaml',
            __DIR__ . '/../../fixtures/source_field_option.yaml',
            __DIR__ . '/../../fixtures/source_field_label.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::createEntityElasticsearchIndices('category');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
        self::deleteEntityElasticsearchIndices('category');
    }

    /**
     * @dataProvider viewMoreOptionDataProvider
     *
     * @param string $entityType         Entity Type
     * @param string $catalogId          Catalog ID or code
     * @param string $aggregation        Aggregation
     * @param ?array $expectedError      Expected error
     * @param ?int   $expectedItemsCount Expected items count in (paged) response
     * @param string $filter             Filters to apply
     */
    public function testViewMoreFacetOptions(
        string $entityType,
        string $catalogId,
        string $aggregation,
        ?array $expectedError,
        ?int $expectedItemsCount,
        string $filter,
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'entityType: "%s", catalogId: "%s", aggregation: "%s", filter: [%s]',
            $entityType,
            $catalogId,
            $aggregation,
            $filter
        );

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        viewMoreFacetOptions({$arguments}) {
                            value
                            label
                            count
                        }
                    }
                GQL,
                $user
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedError, $expectedItemsCount) {
                    if (!empty($expectedError)) {
                        $this->assertJsonContains($expectedError);
                        $this->assertJsonContains(['data' => ['viewMoreFacetOptions' => null]]);
                    } else {
                        $responseData = $response->toArray();
                        $this->assertIsArray($responseData['data']['viewMoreFacetOptions']);
                        $this->assertCount($expectedItemsCount, $responseData['data']['viewMoreFacetOptions']);
                        foreach ($responseData['data']['viewMoreFacetOptions'] as $data) {
                            $this->assertArrayHasKey('value', $data);
                            $this->assertArrayHasKey('label', $data);
                            $this->assertArrayHasKey('count', $data);
                        }
                    }
                }
            )
        );
    }

    public function viewMoreOptionDataProvider(): array
    {
        return [
            [
                'product', // entity type.
                'b2c_en', // catalog ID.
                'invalid_field', // aggregation.
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'The source field \'invalid_field\' does not exist']]], // expected error.
                null, // expected items count.
                '', // filter.
            ],
            [
                'product', // entity type.
                'b2c_en', // catalog ID.
                'size', // aggregation.
                [], // expected error.
                9, // expected items count.
                '', // filter.
            ],
            [
                'product', // entity type.
                'b2c_en', // catalog ID.
                'category', // aggregation.
                [], // expected error.
                4, // expected items count.
                '', // filter.
            ],
            [
                'product', // entity type.
                'b2c_en', // catalog ID.
                'size', // aggregation.
                [], // expected error.
                1, // expected items count.
                '{equalFilter: {field:"sku", eq: "24-MB01"}}', // filter.
            ],
        ];
    }
}
