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
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Standard\src\Test\AbstractEntityTest;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Model\User;
use Symfony\Contracts\HttpClient\ResponseInterface;

class CategoryConfigurationTest extends AbstractEntityTest
{
    protected static function getFixtureFiles(): array
    {
        return [
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
            __DIR__ . '/../../fixtures/catalogs.yaml',
            __DIR__ . '/../../fixtures/categories.yaml',
        ];
    }

    protected function getEntityClass(): string
    {
        return Category\Configuration::class;
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testCreate(
        User $user,
        array $data,
        int $responseCode = 201,
        ?string $message = null,
        string $validRegex = null
    ): void {
        if (isset($data['catalog'])) {
            $catalogRepository = static::getContainer()->get(CatalogRepository::class);
            $catalog = $catalogRepository->findOneBy(['code' => $data['catalog']]);
            $data['catalog'] = "/catalogs/{$catalog->getId()}";
        }
        if (isset($data['localizedCatalog'])) {
            $localizedCatalogRepository = static::getContainer()->get(LocalizedCatalogRepository::class);
            $localizedCatalog = $localizedCatalogRepository->findOneBy(['code' => $data['localizedCatalog']]);
            $data['localizedCatalog'] = "/localized_catalogs/{$localizedCatalog->getId()}";
        }
        $data['category'] = "/categories/{$data['category']}";
        parent::testCreate($user, $data, $responseCode, $message, $validRegex);
    }

    /**
     * {@inheritDoc}
     */
    public function createDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [
                $this->getUser(Role::ROLE_CONTRIBUTOR),
                ['category' => 'one', 'name' => 'One'],
                403,
            ],
            [
                $adminUser,
                ['category' => 'one', 'name' => 'One'],
            ],
            [
                $adminUser,
                ['category' => 'one', 'catalog' => 'b2c', 'name' => 'One'],
            ],
            [
                $adminUser,
                ['category' => 'one', 'catalog' => 'b2c', 'localizedCatalog' => 'b2c_fr', 'name' => 'One'],
            ],
            [
                $adminUser,
                ['category' => 'two', 'catalog' => 'b2c', 'localizedCatalog' => 'b2c_fr', 'name' => 'Two', 'defaultSorting' => 'name'],
            ],
            [
                $adminUser,
                ['category' => 'three', 'catalog' => 'b2c', 'localizedCatalog' => 'b2c_fr', 'name' => 'Three', 'defaultSorting' => 'invalidSort'],
                422,
                'defaultSorting: The option "invalidSort" is not a valid option for sorting.',
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getDataProvider(): iterable
    {
        $user = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 1, ['id' => 'One', 'name' => 'One'], 403],
            [$user, 1, ['id' => 1, 'name' => 'One'], 200],
            [$user, 4, ['id' => 4, 'name' => 'Two'], 200],
            [$user, 10, [], 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function deleteDataProvider(): iterable
    {
        $adminUser = $this->getUser(Role::ROLE_ADMIN);

        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 1, 403],
            [$adminUser, 1, 204],
            [$adminUser, 10, 404],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getCollectionDataProvider(): iterable
    {
        return [
            [$this->getUser(Role::ROLE_CONTRIBUTOR), 3, 403],
            [$this->getUser(Role::ROLE_ADMIN), 3, 200],
        ];
    }

    public function testGetWithContext(): void
    {
        $this->validateApiCall(
            new RequestToTest('GET', "{$this->getApiPath()}/category/one", $this->getUser(Role::ROLE_CONTRIBUTOR)),
            new ExpectedResponse(403)
        );
        $this->validateApiCall(
            new RequestToTest('GET', "{$this->getApiPath()}/category/one", $this->getUser(Role::ROLE_ADMIN)),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) {
                    $this->assertJsonContains(['name' => 'One']);
                }
            )
        );
        $this->validateApiCall(
            new RequestToTest('GET', "{$this->getApiPath()}/category/ten", $this->getUser(Role::ROLE_ADMIN)),
            new ExpectedResponse(404)
        );
    }
}
