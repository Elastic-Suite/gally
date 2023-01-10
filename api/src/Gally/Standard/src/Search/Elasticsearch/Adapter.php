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

namespace Gally\Search\Elasticsearch;

use Elasticsearch\Client;
use Exception;
use Gally\Search\Elasticsearch\Adapter\Common\Request;
use Gally\Search\Elasticsearch\Adapter\Common\Response;
use Gally\Search\Elasticsearch\Builder\Response\AggregationBuilder;
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

            try {
                $searchResponse = $this->client->search($searchRequest);
            } catch (Exception $e) {
                $searchResponse = [];
                $this->logger->error($e->getMessage());
            }
        } catch (Exception $e) {
            $searchRequest = [];
            $searchResponse = [];
            $this->logger->error($e->getMessage());
        }

        return new Response\QueryResponse($searchRequest, $searchResponse, $this->aggregationBuilder);
    }
}
