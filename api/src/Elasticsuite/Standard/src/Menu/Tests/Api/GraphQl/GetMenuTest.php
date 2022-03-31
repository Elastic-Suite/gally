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

namespace Elasticsuite\Index\Tests\Api\GraphQl;

use Elasticsuite\Index\Tests\Api\AbstractMenuTest;

class GetMenuTest extends AbstractMenuTest
{
    /**
     * @dataProvider menuDataProvider
     */
    public function testGetMenu(string $local, array $response): void
    {
        $query = <<<GQL
            {
              getMenu {
                 hierarchy
              }
            }
        GQL;

        $this->requestGraphQl($query, ['Accept-Language' => $local]);
        $this->assertJsonContains(['data' => ['getMenu' => $response]]);
    }
}
