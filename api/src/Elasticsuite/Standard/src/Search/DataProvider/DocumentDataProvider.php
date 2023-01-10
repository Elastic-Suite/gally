<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
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
use Elasticsuite\Search\GraphQl\Type\Definition\SortInputType;
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
        private SortInputType $sortInputType,
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
        $metadata = $this->metadataRepository->findByEntity($context['filters']['entityType']);
        $localizedCatalog = $this->catalogRepository->findByCodeOrId($context['filters']['localizedCatalog']);
        $containerConfig = $this->containerConfigurationProvider->get($metadata, $localizedCatalog);

        $this->filterManager->validateFilters($context, $containerConfig);

        $searchQuery = $context['filters']['search'] ?? null;

        $limit = $this->pagination->getLimit($resourceClass, $operationName, $context);
        $offset = $this->pagination->getOffset($resourceClass, $operationName, $context);

        $request = $this->requestBuilder->create(
            $containerConfig,
            $offset,
            $limit,
            $searchQuery,
            $this->sortInputType->formatSort($containerConfig, $context, $metadata),
            $this->filterManager->transformToElasticsuiteFilters(
                $this->filterManager->getFiltersFromContext($context),
                $containerConfig
            ),
            [],
            ($context['need_aggregations'] ?? false) ? [] : null
        );
        $response = $this->adapter->search($request);

        return new Paginator(
            $this->denormalizer,
            $request,
            $response,
            $resourceClass,
            $limit,
            $offset,
            $context
        );
    }
}
