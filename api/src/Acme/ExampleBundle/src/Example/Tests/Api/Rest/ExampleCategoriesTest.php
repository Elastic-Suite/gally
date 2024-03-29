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
use Gally\User\Constant\Role;
use Gally\User\Tests\LoginTrait;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Liip\TestFixturesBundle\Services\DatabaseTools\AbstractDatabaseTool;

/**
 * Documentation: https://api-platform.com/docs/distribution/testing/.
 */
class ExampleCategoriesTest extends ApiTestCase
{
    use LoginTrait;

    private AbstractDatabaseTool $databaseTool;

    protected function setUp(): void
    {
        $this->databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();
    }

    public function testGetCollection(): void
    {
        $this->databaseTool->loadAliceFixture(array_merge([__DIR__ . '/../../fixtures/categories_example.yaml'], $this->getUserFixtures()));
        $client = static::createClient();

        $client->request('GET', '/example_categories', ['auth_bearer' => $this->loginRest($client, $this->getUser(Role::ROLE_CONTRIBUTOR))]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/ExampleCategory',
            '@id' => '/example_categories',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);
    }
}
