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

namespace Elasticsuite\Index\Model\Index\Mapping;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Index\DataProvider\MappingStatusDataProvider;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: [],
        graphql: [
            'get' => [
                'item_query' => MappingStatusDataProvider::class,
                'args' => [
                    'entityType' => ['type' => 'String!'],
                ],
                'security' => "is_granted('" . Role::ROLE_ADMIN . "')",
            ],
        ],
        itemOperations: [
            'get',
        ],
        shortName: 'MappingStatus',
    )
]
class Status
{
    public const Green = 'green';     // Current index mapping is accurate with metadata
    public const Yellow = 'yellow';   // Current index mapping is not accurate, mapping will be taken into account on next reindex
    public const Red = 'red';         // Current index metadata is not enough qualified

    #[ApiProperty(identifier: true)]
    public string $entityType;

    public string $status;

    public function __construct(string $entityType, string $status)
    {
        $this->entityType = $entityType;
        $this->status = $status;
    }
}
