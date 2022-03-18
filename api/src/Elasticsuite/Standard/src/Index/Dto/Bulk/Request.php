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

namespace Elasticsuite\Index\Dto\Bulk;

use Elasticsuite\Index\Model\Index;

/**
 * Implementation for ES bulk request.
 */
class Request
{
    /**
     * Bulk operation stack.
     */
    private array $bulkData = [];

    /**
     * Indicates if the current bulk contains operation.
     */
    public function isEmpty(): bool
    {
        return 0 == \count($this->bulkData);
    }

    /**
     * Return list of operations to be executed as an array.
     */
    public function getOperations(): array
    {
        return $this->bulkData;
    }

    /**
     * Add a single document to the index.
     */
    public function addDocument(Index $index, string|int $docId, array $data): self
    {
        $this->bulkData[] = ['index' => ['_index' => $index->getName(), '_type' => '_doc', '_id' => $docId]];
        $this->bulkData[] = $data;

        return $this;
    }

    /**
     * Add a several documents to the index.
     * $data format have to be an array of all documents with document id as key.
     */
    public function addDocuments(Index $index, array $data): self
    {
        array_walk(
            $data,
            function ($documentData, $identifier) use ($index) {
                $this->addDocument($index, $identifier, $documentData);
            }
        );

        return $this;
    }

    /**
     * Delete a document from the index.
     */
    public function deleteDocument(Index $index, string|int $docId): self
    {
        $this->bulkData[] = ['delete' => ['_index' => $index->getName(), '_type' => '_doc', '_id' => $docId]];

        return $this;
    }

    /**
     * Delete multiple documents from the index.
     */
    public function deleteDocuments(Index $index, array $documentIds): self
    {
        array_walk(
            $documentIds,
            function ($documentData, $identifier) use ($index) {
                $this->deleteDocument($index, $identifier);
            }
        );

        return $this;
    }
}
