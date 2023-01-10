<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Index\Tests\Api\Rest;

use Gally\Index\Tests\Api\AbstractMenuTest;
use Gally\Locale\EventSubscriber\LocaleSubscriber;
use Gally\Test\ExpectedResponse;
use Gally\Test\RequestToTest;
use Gally\User\Constant\Role;
use Symfony\Contracts\HttpClient\ResponseInterface;

class GetMenuTest extends AbstractMenuTest
{
    /**
     * @dataProvider menuDataProvider
     */
    public function testGetMenu(string $local, array $expectedResponse): void
    {
        $this->validateApiCall(
            new RequestToTest('GET', 'menu', $this->getUser(Role::ROLE_CONTRIBUTOR), [], [LocaleSubscriber::GALLY_LANGUAGE_HEADER => $local]),
            new ExpectedResponse(
                200,
                function (ResponseInterface $response) use ($expectedResponse) {
                    $this->assertJsonContains($expectedResponse);
                }
            )
        );
    }
}
