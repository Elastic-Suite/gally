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

namespace Elasticsuite\Index\Tests\Api\Rest;

use Elasticsuite\Index\Tests\Api\AbstractMenuTest;
use Elasticsuite\Locale\EventSubscriber\LocaleSubscriber;
use Elasticsuite\Standard\src\Test\ExpectedResponse;
use Elasticsuite\Standard\src\Test\RequestToTest;
use Elasticsuite\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GetMenuTest extends AbstractMenuTest
{
    /**
     * @dataProvider menuDataProvider
     */
    public function testGetMenu(string $local, array $expectedResponse): void
    {
        $this->validateApiCall(
            new RequestToTest('GET', 'menu', $this->getUser(Role::ROLE_CONTRIBUTOR), [], [LocaleSubscriber::ELASTICSUITE_LANGUAGE_HEADER => $local]),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedResponse) {
                    $this->assertJsonContains($expectedResponse);
                }
            )
        );
    }
}
