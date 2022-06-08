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

namespace Elasticsuite\Search\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\Pagination;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder as RequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Search\Model\Document;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class DocumentDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
        private Pagination $pagination,
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private RequestBuilder $requestBuilder,
        private Adapter $adapter,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Document::class === $resourceClass;
    }

    /**
     * {@inheritDoc}
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        $entityType = $context['filters']['entityType'];
        $catalogId = $context['filters']['catalogId'];
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
        if (!$metadata) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
        }
        if (null === $metadata->getEntity()) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] is not defined', $entityType));
        }
        if (is_numeric($catalogId)) {
            $catalog = $this->catalogRepository->find($catalogId);
        } else {
            $catalog = $this->catalogRepository->findOneBy(['code' => $catalogId]);
        }
        if (null === $catalog) {
            throw new InvalidArgumentException(sprintf('Missing catalog [%s]', $catalogId));
        }

        $sortOrders = [];
        if (\array_key_exists('sort', $context['filters'])) {
            $field = $context['filters']['sort']['field'];
            $direction = $context['filters']['sort']['direction'] ?? SortOrderInterface::DEFAULT_SORT_DIRECTION;
            $sortOrders = [$field => ['direction' => $direction]];
        }

        $limit = $this->pagination->getLimit($resourceClass, $operationName, $context);
        $offset = $this->pagination->getOffset($resourceClass, $operationName, $context);

        $request = $this->requestBuilder->create(
            $metadata,
            $catalog->getId(),
            $offset,
            $limit,
            null,
            $sortOrders
        );
        $response = $this->adapter->search($request);

        return new Paginator(
            $this->denormalizer,
            $response,
            $resourceClass,
            $limit,
            $offset,
            $context
        );
    }
}
