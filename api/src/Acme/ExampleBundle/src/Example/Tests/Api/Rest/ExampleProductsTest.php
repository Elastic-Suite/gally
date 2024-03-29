<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Tests\Api\Rest;

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase;
use Gally\Fixture\Service\ElasticsearchFixtures;
use Gally\User\Constant\Role;
use Gally\User\Tests\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;

/**
 * Documentation: https://api-platform.com/docs/distribution/testing/.
 */
class ExampleProductsTest extends ApiTestCase
{
    use LoginTrait;

    private ?ElasticsearchFixtures $elasticsearchFixtures;

    protected function setUp(): void
    {
        $databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
        $databaseTool->loadAliceFixture($this->getUserFixtures());
        $this->elasticsearchFixtures = static::getContainer()->get(ElasticsearchFixtures::class);
        $this->elasticsearchFixtures->deleteTestFixtures();
        $this->elasticsearchFixtures->loadFixturesIndexFiles([__DIR__ . '/../../fixtures/index_example.json']);
        $this->elasticsearchFixtures->loadFixturesDocumentFiles([__DIR__ . '/../../fixtures/products_example.json']);
    }

    public function testGetCollection(): void
    {
        $client = static::createClient();
        $client->request('GET', '/example_products', ['auth_bearer' => $this->loginRest($client, $this->getUser(Role::ROLE_CONTRIBUTOR))]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/ExampleProduct',
            '@id' => '/example_products',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);
    }

    protected function tearDown(): void
    {
        $this->elasticsearchFixtures->deleteTestFixtures();

        parent::tearDown();
    }
}
