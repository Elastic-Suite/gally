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

namespace Elasticsuite\Index\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\User\Constant\Role;

#[
    ApiResource(
        collectionOperations: [
            'get',
            'post' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        graphql: [
            'item_query',
            'collection_query',
            'create' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        itemOperations: [
            'get',
            'delete' => ['security' => "is_granted('" . Role::ROLE_ADMIN . "')"],
        ],
        paginationEnabled: false,
    ),
]
class IndexDocument
{
    #[ApiProperty(
        identifier: true
    )]
    private string $indexName;

    /**
     * @var string[]
     */
    private array $documents;

    public function __construct(
        string $indexName,
        array $documents
    ) {
        $this->indexName = $indexName;
        $this->documents = $documents;
    }

    public function getIndexName(): string
    {
        return $this->indexName;
    }

    public function setIndexName(string $indexName): void
    {
        $this->indexName = $indexName;
    }

    public function getDocuments(): array
    {
        return $this->documents;
    }

    public function setDocuments(array $documents): void
    {
        $this->documents = $documents;
    }
}
