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

namespace Elasticsuite\Category\Tests\Api\GraphQl;

use Elasticsuite\Test\AbstractTest;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestGraphQlToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategorySortingOptionTest extends AbstractTest
{
    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::loadFixture([
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/metadata.yaml',
        ]);
    }

    public function testGetCollection(): void
    {
        $this->validateApiCall(
            new RequestGraphQlToTest(
                <<<GQL
                    {
                      categorySortingOptions {
                        code
                        label
                      }
                    }
                GQL,
                $this->getUser(Role::ROLE_CONTRIBUTOR),
            ),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $responseData = $response->toArray();
                    $this->assertSame(
                        [
                            ['code' => 'name', 'label' => 'Name'],
                            ['code' => 'category__position', 'label' => 'Category.position'],
                            ['code' => 'real_category__position', 'label' => 'Position'],
                            ['code' => 'price__price', 'label' => 'Price'],
                            ['code' => 'stock__status', 'label' => 'Stock status'],
                            ['code' => '_score', 'label' => 'Relevance'],
                        ],
                        $responseData['data']['categorySortingOptions']
                    );
                }
            )
        );
    }
}
