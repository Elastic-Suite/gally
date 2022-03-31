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

use Elasticsuite\Standard\src\Test\AbstractTest;

class MappingStatusTest extends AbstractTest
{
    /**
     * @dataProvider mappingStatusDataProvider
     */
    public function testGetMappingStatus(string $entity, ?string $status)
    {
        $this->loadFixture([
            __DIR__ . '/../../fixtures/metadata.yaml',
            __DIR__ . '/../../fixtures/source_field.yaml',
        ]);
        $query = <<<GQL
            {
              getMappingStatus(entityType: "{$entity}") {
                    status
              }
            }
        GQL;

        $this->requestGraphQl($query);
        $this->assertJsonContains([
            'data' => [
                'getMappingStatus' => $status ? ['status' => $status] : null,
            ],
        ]);
    }

    public function mappingStatusDataProvider(): array
    {
        return [
            ['product', 'green'],
            ['category', 'red'],
            ['cms', null],
        ];
    }
}
