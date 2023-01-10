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

namespace Gally\Product\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\Pagination;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Product\GraphQl\Type\Definition\SortInputType;
use Gally\Product\Model\Product;
use Gally\ResourceMetadata\Service\ResourceMetadataManager;
use Gally\Search\DataProvider\Paginator;
use Gally\Search\Elasticsearch\Adapter;
use Gally\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder as RequestBuilder;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Gally\Search\Service\GraphQl\FilterManager;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class ProductDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private DenormalizerInterface $denormalizer,
        private Pagination $pagination,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ResourceMetadataManager $resourceMetadataManager,
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private RequestBuilder $requestBuilder,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private Adapter $adapter,
        private SortInputType $sortInputType,
        private FilterManager $filterManager,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Product::class === $resourceClass;
    }

    /**
     * {@inheritDoc}
     *
     * @throws ResourceClassNotFoundException
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        $resourceMetadata = $this->resourceMetadataFactory->create($resourceClass);
        $entityType = $this->resourceMetadataManager->getMetadataEntity($resourceMetadata);
        if (null === $entityType) {
            throw new ResourceClassNotFoundException(sprintf('Resource "%s" has no declared metadata entity.', $resourceClass));
        }

        // TODO Supposed to be pulled from header.
        $localizedCatalogCode = $context['filters']['localizedCatalog'];
        $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
        if (!$metadata) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
        }
        if (null === $metadata->getEntity()) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] is not defined', $entityType));
        }

        $localizedCatalog = $this->localizedCatalogRepository->findByCodeOrId($localizedCatalogCode);

        $containerConfig = $this->containerConfigurationProvider->get(
            $metadata,
            $localizedCatalog,
            $context['filters']['requestType']
        );

        $this->filterManager->validateFilters($context, $containerConfig);
        $this->sortInputType->validateSort($context);

        $searchQuery = $context['filters']['search'] ?? null;
        $limit = $this->pagination->getLimit($resourceClass, $operationName, $context);
        $offset = $this->pagination->getOffset($resourceClass, $operationName, $context);

        // Get query filter and set current category.
        $queryFilter = $this->filterManager->transformToGallyFilters(
            $this->filterManager->getQueryFilterFromContext($context),
            $containerConfig
        );

        $request = $this->requestBuilder->create(
            $containerConfig,
            $offset,
            $limit,
            $searchQuery,
            $this->sortInputType->formatSort($containerConfig, $context, $metadata),
            $this->filterManager->transformToGallyFilters(
                $this->filterManager->getFiltersFromContext($context),
                $containerConfig
            ),
            $queryFilter,
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
