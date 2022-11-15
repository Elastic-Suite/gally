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

namespace Elasticsuite\Category\Tests\Api\Rest;

use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Test\ExpectedResponse;
use Elasticsuite\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategoryTreeTest extends CategoryTest
{
    public function testInvalidCatalog(): void
    {
        $this->getCategoryTree('b2c_it');
    }

    protected function getCategoryTree(?string $catalogCode = null, ?string $localizedCatalogCode = null): array
    {
        $expectedResponseCode = 200;
        $responseData = [];
        $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
        $catalogRepository = static::getContainer()->get(CatalogRepository::class);

        $params = [];
        if ($catalogCode) {
            $catalog = $catalogRepository->findOneBy(['code' => $catalogCode]);
            $params[] = 'catalogId=' . ($catalog ? $catalog->getId() : '999');
            $expectedResponseCode = $catalog ? 200 : 404;
        }
        if ($localizedCatalogCode) {
            $localizedCatalog = $localizedCatalogRepository->findOneBy(['code' => $localizedCatalogCode]);
            $params[] = 'localizedCatalogId=' . ($localizedCatalog ? $localizedCatalog->getId() : '999');
            $expectedResponseCode = $localizedCatalog ? 200 : 404;
        }

        $query = !empty($params) ? '?' . implode('&', $params) : '';

        $this->validateApiCall(
            new RequestToTest('GET', "categoryTree$query", $this->getUser(Role::ROLE_ADMIN)),
            new ExpectedResponse(
                $expectedResponseCode,
                function (ResponseInterface $response) use (&$responseData) {
                    $responseData = $response->toArray()['categories'];
                }
            )
        );

        return $responseData;
    }
}
