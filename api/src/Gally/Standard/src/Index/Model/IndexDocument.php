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

namespace Gally\Index\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Gally\User\Constant\Role;

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
