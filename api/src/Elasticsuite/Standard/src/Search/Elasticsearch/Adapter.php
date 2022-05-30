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

namespace Elasticsuite\Search\Elasticsearch;

use Elasticsearch\Client;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;
use Elasticsuite\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Exception;
use Psr\Log\LoggerInterface;

class Adapter
{
    public function __construct(
        private Request\Mapper $requestMapper,
        private Client $client,
        private AggregationBuilder $aggregationBuilder,
        private LoggerInterface $logger
    ) {
    }

    public function search(RequestInterface $request): ResponseInterface
    {
        try {
            $searchRequest = [
                'index' => $request->getIndex(),
                'body' => $this->requestMapper->assembleSearchRequest($request),
            ];
            $searchResponse = $this->client->search($searchRequest);
        } catch (Exception $e) {
            $searchResponse = [];
            $this->logger->error($e->getMessage());
        }

        return new Response\QueryResponse($searchResponse, $this->aggregationBuilder);
    }
}
