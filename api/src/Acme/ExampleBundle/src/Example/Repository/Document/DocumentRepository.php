<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Repository\Document;

use Elasticsearch\Client;

class DocumentRepository implements DocumentRepositoryInterface
{
    public function __construct(
        private Client $client
    ) {
    }

    public function index(string $indexName, array $documents): void
    {
        $params = [];
        $responses = [];
        foreach ($documents as $document) {
            $document = json_decode($document, true);
            $params['body'][] = [
                'index' => [
                    '_index' => $indexName,
                    '_id' => $document['entity_id'],
                ],
            ];

            $params['body'][] = $document;
        }

        if (\count($params) > 0) {
            $responses = $this->client->bulk($params);
        }
    }

    public function delete(string $indexName, array $documents): void
    {
        dd($documents);
        /**
         * @Todo: Implement the right way to delete an Index
         */
        foreach ($documents as $document) { // @phpstan-ignore-line
            $response = $this->client->delete([
                'index' => $indexName,
                'id' => $document['entity_id'],
            ]);
        }
    }
}
