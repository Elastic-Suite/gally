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

namespace Elasticsuite\Product\Tests\Api\GraphQl;

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
            __DIR__ . '/../../fixtures/category_configurations.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
        self::createEntityElasticsearchIndices('product');
        self::loadElasticsearchDocumentFixtures([__DIR__ . '/../../fixtures/product_documents.json']);
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass();
        self::deleteEntityElasticsearchIndices('product');
    }

    /**
     * @dataProvider viewMoreOptionDataProvider
     *
     * @param string  $catalogId          Catalog ID or code
     * @param string  $aggregation        Aggregation
     * @param ?string $currentCategoryId  Current category id
     * @param ?array  $expectedError      Expected error
     * @param ?int    $expectedItemsCount Expected items count in (paged) response
     * @param string  $filter             Filters to apply
     */
    public function testViewMoreFacetOptions(
        string $catalogId,
        string $aggregation,
        ?string $currentCategoryId,
        ?array $expectedError,
        ?int $expectedItemsCount,
        string $filter,
    ): void {
        $user = $this->getUser(Role::ROLE_CONTRIBUTOR);

        $arguments = sprintf(
            'catalogId: "%s", aggregation: "%s", filter: {%s}',
            $catalogId,
            $aggregation,
            $filter
        );

        if ($currentCategoryId) {
            $arguments .= sprintf(', currentCategoryId: "%s"', $currentCategoryId);
        }

        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                        viewMoreProductFacetOptions({$arguments}) {
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
                        $this->assertJsonContains(['data' => ['viewMoreProductFacetOptions' => null]]);
                    } else {
                        $responseData = $response->toArray();
                        $this->assertIsArray($responseData['data']['viewMoreProductFacetOptions']);
                        $this->assertCount($expectedItemsCount, $responseData['data']['viewMoreProductFacetOptions']);
                        foreach ($responseData['data']['viewMoreProductFacetOptions'] as $data) {
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
                'b2c_en', // catalog ID.
                'invalid_field', // aggregation.
                null, // current category id.
                ['errors' => [['message' => 'Internal server error', 'debugMessage' => 'The source field \'invalid_field\' does not exist']]], // expected error.
                null, // expected items count.
                '', // filter.
            ],
            [
                'b2c_en', // catalog ID.
                'size', // aggregation.
                null, // current category id.
                [], // expected error.
                9, // expected items count.
                '', // filter.
            ],
            [
                'b2c_en', // catalog ID.
                'size', // aggregation.
                'cat_3', // current category id.
                [], // expected error.
                2, // expected items count.
                '', // filter.
            ],
            [
                'b2c_en', // catalog ID.
                'size', // aggregation.
                'cat_5', // current category id.
                [], // expected error.
                1, // expected items count.
                'sku: { eq: "24-MB01" }', // filter.
            ],
            [
                'b2c_en', // catalog ID.
                'category__id', // aggregation.
                'cat_3', // current category id.
                [], // expected error.
                1, // expected items count.
                '', // filter.
            ],
        ];
    }
}
