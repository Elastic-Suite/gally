<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Index
 * @author    Botis <botis@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Index\Repository\Document;

use Elasticsearch\Client;

class DocumentRepository implements DocumentRepositoryInterface
{
    public function __construct(
        private Client $client
    ) {
    }

    public function index(string $indexName, array $documents, bool $instantRefresh = false): void
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
            if ($instantRefresh) {
                $params['refresh'] = 'wait_for';
            }
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
        foreach ($documents as $document) {
            $response = $this->client->delete([
                'index' => $indexName,
                'id' => $document['entity_id'],
            ]);
        }
    }
}
