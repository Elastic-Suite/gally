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
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder as RequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Search\Model\Document;
use Elasticsuite\Search\Service\GraphQl\FilterManager;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class DocumentDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
        private Pagination $pagination,
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private RequestBuilder $requestBuilder,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private Adapter $adapter,
        private FilterManager $filterManager,
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
        $this->filterManager->validateFilters($context);

        $metadata = $this->metadataRepository->findByEntity($context['filters']['entityType']);
        $catalog = $this->catalogRepository->findByCodeOrId($context['filters']['catalogId']);
        $containerConfig = $this->containerConfigurationProvider->get($metadata, $catalog);

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
            $catalog,
            $offset,
            $limit,
            null,
            $sortOrders,
            $this->filterManager->formatFilters($context, $containerConfig),
            [],
            ($context['need_aggregations'] ?? false) ? [] : null
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
