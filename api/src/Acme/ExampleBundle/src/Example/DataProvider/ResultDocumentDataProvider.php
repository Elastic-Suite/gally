<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Acme\Example\Example\DataProvider;

use Acme\Example\Example\Model\ExampleResultDocument;
use Acme\Example\Example\Repository\ResultDocument\ResultDocumentRepositoryInterface;
use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\Pagination;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use ApiPlatform\Core\Bridge\Elasticsearch\DataProvider\Paginator;

class ResultDocumentDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
        private Pagination $pagination,
        private ResultDocumentRepositoryInterface $resultDocumentRepository,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ExampleResultDocument::class === $resourceClass;
    }

    /**
     * {@inheritdoc}
     *
     * Inspired by \ApiPlatform\Core\Bridge\Elasticsearch\DataProvider\CollectionDataProvider::getCollection
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        $body = [];
        $body['query'] = ['match_all' => new \stdClass()];

        $limit = $body['size'] = $body['size'] ?? $this->pagination->getLimit($resourceClass, $operationName, $context);
        $offset = $body['from'] = $body['from'] ?? $this->pagination->getOffset($resourceClass, $operationName, $context);

        // You can get all filters from the context ($context['filters']['filter_name']).
        $documents = $this->resultDocumentRepository->search(
            $context['filters']['indexName'],
            $body
        );

        return new Paginator(
            $this->denormalizer,
            $documents,
            $resourceClass,
            $limit,
            $offset,
            $context
        );
    }
}
