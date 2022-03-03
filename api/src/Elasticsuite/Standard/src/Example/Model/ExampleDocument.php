<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Example
 * @author    Botis <botis@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Example\Model;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

#[
    ApiResource(
        collectionOperations: ['post', 'get'],
        itemOperations: ['get', 'delete'],
        paginationEnabled: false,
    ),
]
class ExampleDocument
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
