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

namespace Elasticsuite\Search\DataProvider\Facet;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Elasticsuite\Search\Model\Facet\Option;
use Elasticsuite\Search\Service\GraphQl\FilterManager;
use Elasticsuite\Search\Service\ReverseSourceFieldProvider;
use Elasticsuite\Search\Service\ViewMoreContext;

class OptionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private SimpleRequestBuilder $requestBuilder,
        private Adapter $searchEngine,
        private FilterManager $filterManager,
        private ViewMoreContext $viewMoreContext,
        private ReverseSourceFieldProvider $reverseSourceFieldProvider,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        private string $nestingSeparator,
    ) {
    }

    public function getCollection(string $resourceClass, string $operationName = null, array $context = [])
    {
        $metadata = $this->metadataRepository->findByEntity($context['filters']['entityType']);
        $localizedCatalog = $this->catalogRepository->findByCodeOrId($context['filters']['localizedCatalog']);
        $filterName = str_replace($this->nestingSeparator, '.', $context['filters']['aggregation']);
        $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($filterName, $metadata);
        if (null === $sourceField) {
            throw new \InvalidArgumentException("The source field '$filterName' does not exist");
        }

        $this->viewMoreContext->setFilterName($filterName);
        $this->viewMoreContext->setSourceField($sourceField);

        $containerConfig = $this->containerConfigurationProvider->get($metadata, $localizedCatalog);

        $this->filterManager->validateFilters($context, $containerConfig);
        $searchQuery = $context['filters']['search'] ?? null;

        $request = $this->requestBuilder->create(
            $containerConfig,
            0,
            0,
            $searchQuery,
            [],
            $this->filterManager->transformToElasticsuiteFilters(
                $this->filterManager->getFiltersFromContext($context),
                $containerConfig
            ),
            $this->filterManager->transformToElasticsuiteFilters(
                $this->filterManager->getQueryFilterFromContext($context),
                $containerConfig
            ),
            []
        );
        $response = $this->searchEngine->search($request);

        $options = [];

        if (\array_key_exists($filterName, $response->getAggregations())) {
            $labels = [];
            if (Type::TYPE_CATEGORY === $sourceField->getType()) {
                // Extract categories ids from aggregations options (with result) to hydrate labels from DB
                $categoryIds = array_map(
                    fn ($item) => $item->getKey(),
                    array_filter($response->getAggregations()[$filterName]->getValues(), fn ($item) => $item->getCount())
                );
                $categories = $this->categoryConfigurationRepository->findBy(
                    ['category' => $categoryIds, 'localizedCatalog' => $containerConfig->getLocalizedCatalog()]
                );
                // Get the name of all categories in aggregation result
                array_walk(
                    $categories,
                    function ($categoryConfig) use (&$labels) {
                        $labels[$categoryConfig->getCategory()->getId()] = $categoryConfig->getName();
                    }
                );
            }

            /** @var Adapter\Common\Response\BucketValueInterface $option */
            foreach ($response->getAggregations()[$filterName]->getValues() as $option) {
                if (0 === $option->getCount()) {
                    continue;
                }

                $options[] = \is_array($option->getKey())
                    ? new Option((string) $option->getKey()[1], (string) $option->getKey()[0], $option->getCount())
                    : new Option((string) $option->getKey(), $labels[$option->getKey()] ?? (string) $option->getKey(), $option->getCount());
            }
        }

        return $options;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Option::class === $resourceClass;
    }
}
