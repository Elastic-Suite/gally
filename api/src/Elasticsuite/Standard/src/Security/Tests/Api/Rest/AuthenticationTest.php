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

namespace Elasticsuite\Security\Tests\Api\Rest;

use Elasticsuite\Standard\src\Test\AbstractTest;
use Elasticsuite\User\Constant\Role;
use Elasticsuite\User\Test\LoginTrait;

class AuthenticationTest extends AbstractTest
{
    use LoginTrait;

    public function testLoginRest(): void
    {
        $this->loadFixture([]);

        $client = self::createClient();
        $catalog = ['code' => 'login_rest_catalog', 'name' => 'Login Rest catalog'];

        // Test before login
        $client->request('GET', '/catalogs');
        $this->assertResponseStatusCodeSame(200);
        $client->request('POST', '/catalogs', ['json' => $catalog]);
        $this->assertResponseStatusCodeSame(401);

        // Log contributor
        $token = $this->loginRest($client, $this->getUser(Role::ROLE_CONTRIBUTOR));
        $this->assertResponseIsSuccessful();
        $this->assertNotEmpty($token);

        // Test not authorized.
        $client->request('GET', '/catalogs');
        $this->assertResponseStatusCodeSame(200);
        $client->request('POST', '/catalogs', ['auth_bearer' => $token, 'json' => $catalog]);
        $this->assertResponseStatusCodeSame(403);

        // Log admin
        $token = $this->loginRest($client, $this->getUser(Role::ROLE_ADMIN));
        $this->assertResponseIsSuccessful();
        $this->assertNotEmpty($token);

        // Test authorized.
        $client->request('GET', '/catalogs');
        $this->assertResponseStatusCodeSame(200);
        $client->request('POST', '/catalogs', ['auth_bearer' => $token, 'json' => $catalog]);
        $this->assertResponseStatusCodeSame(201);

        $this->logout();
    }
}
