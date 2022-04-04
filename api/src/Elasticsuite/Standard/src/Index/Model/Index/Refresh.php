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

namespace Elasticsuite\Index\Model\Index;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Index\Dto\RefreshIndexInput;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: [
        ],
        graphql: [],
        itemOperations: [
            'put' => [
                'openapi_context' => [
                    'description' => 'Refreshes an Index resource',
                    'summary' => 'Refreshes an Index resource',
                ],
                'path' => '/refresh/{name}',
                'method' => 'PUT',
                'input' => RefreshIndexInput::class,
                'deserialize' => true,
                'read' => true,
                'write' => false,
                'serialize' => true,
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        shortName: 'IndexRefresh',
        normalizationContext: [
            'iri_only' => true,
        ],
        routePrefix: '/indices',
    )
]
class Refresh
{
    #[ApiProperty(
        identifier: true
    )]
    public string $name;
}
