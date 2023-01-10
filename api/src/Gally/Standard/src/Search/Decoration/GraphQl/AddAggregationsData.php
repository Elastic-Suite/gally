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

namespace Gally\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Resolver\Stage\SerializeStageInterface;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Category\Repository\CategoryConfigurationRepository;
use Gally\Category\Service\CurrentCategoryProvider;
use Gally\Metadata\Model\SourceField;
use Gally\Metadata\Model\SourceField\Type;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\DataProvider\Paginator;
use Gally\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;
use Gally\Search\Elasticsearch\Adapter\Common\Response\BucketValueInterface;
use Gally\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Model\Document;
use Gally\Search\Repository\Facet\ConfigurationRepository;
use Gally\Search\Service\ReverseSourceFieldProvider;

/**
 * Add aggregations data in graphql search document response.
 */
class AddAggregationsData implements SerializeStageInterface
{
    public const AGGREGATION_TYPE_CHECKBOX = 'checkbox';
    public const AGGREGATION_TYPE_BOOLEAN = 'boolean';
    public const AGGREGATION_TYPE_SLIDER = 'slider';
    public const AGGREGATION_TYPE_CATEGORY = 'category';

    public function __construct(
        private SerializeStageInterface $decorated,
        private MetadataRepository $metadataRepository,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private ConfigurationRepository $facetConfigRepository,
        private CurrentCategoryProvider $currentCategoryProvider,
        private ReverseSourceFieldProvider $reverseSourceFieldProvider,
        private CategoryConfigurationRepository $categoryConfigurationRepository,
        private iterable $availableFilterTypes,
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        $data = $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);

        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $metadata = $this->metadataRepository->findByEntity($context['args']['entityType']);
            $localizedCatalog = $this->localizedCatalogRepository->findByCodeOrId($context['args']['localizedCatalog']);
            $containerConfig = $this->containerConfigurationProvider->get($metadata, $localizedCatalog, $context['args']['requestType'] ?? null);
            $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
            $this->facetConfigRepository->setCategoryId($currentCategory?->getId());
            $this->facetConfigRepository->setMetadata($containerConfig->getMetadata());

            /** @var Paginator $itemOrCollection */
            $aggregations = $itemOrCollection->getAggregations();
            if (!empty($aggregations)) {
                $data['aggregations'] = [];
                foreach ($aggregations as $aggregation) {
                    if (empty($aggregation->getValues())) {
                        continue;
                    }
                    $data['aggregations'][] = $this->formatAggregation($aggregation, $containerConfig);
                }
            }
        }

        return $data;
    }

    private function formatAggregation(AggregationInterface $aggregation, ContainerConfigurationInterface $containerConfig): array
    {
        $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($aggregation->getField(), $containerConfig->getMetadata());

        $fieldName = $aggregation->getField();
        if ($sourceField) {
            foreach ($this->availableFilterTypes as $type) {
                if ($type->supports($sourceField)) {
                    $fieldName = $type->getGraphQlFieldName($type->getFilterFieldName($sourceField->getCode()));
                    break;
                }
            }
        }

        $data = [
            'field' => $fieldName,
            'label' => $sourceField ? $sourceField->getLabel($containerConfig->getLocalizedCatalog()->getId()) : $aggregation->getField(),
            'type' => match ($sourceField?->getType()) {
                Type::TYPE_PRICE, Type::TYPE_FLOAT, Type::TYPE_INT => self::AGGREGATION_TYPE_SLIDER,
                Type::TYPE_CATEGORY => self::AGGREGATION_TYPE_CATEGORY,
                Type::TYPE_STOCK => self::AGGREGATION_TYPE_BOOLEAN,
                default => self::AGGREGATION_TYPE_CHECKBOX,
            },
            'count' => $aggregation->getCount(),
            'options' => null,
        ];

        $this->formatOptions($aggregation, $sourceField, $containerConfig, $data);

        return $data;
    }

    private function formatOptions(AggregationInterface $aggregation, ?SourceField $sourceField, ContainerConfigurationInterface $containerConfig, array &$data)
    {
        if (!empty($aggregation->getValues())) {
            $data['options'] = [];
            $data['count'] = $aggregation->getCount();
            $data['hasMore'] = false;
        }
        $facetConfigs = $sourceField ? $this->facetConfigRepository->findOndBySourceField($sourceField) : null;
        $labels = [];

        if (Type::TYPE_CATEGORY === $sourceField->getType()) {
            // Extract categories ids from aggregations options (with result) to hydrate labels from DB
            $categoryIds = array_map(
                fn ($item) => $item->getKey(),
                array_filter($aggregation->getValues(), fn ($item) => $item->getCount())
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

        foreach ($aggregation->getValues() as $value) {
            if ($value instanceof BucketValueInterface) {
                $key = $value->getKey();

                if (AggregationBuilder::OTHER_DOCS_KEY === $key) {
                    $data['hasMore'] = true;
                    continue;
                }

                if (0 === $value->getCount()) {
                    continue;
                }

                if (\is_array($key)) {
                    $code = $key[1];
                    $label = 'None' !== $key[0] ? $key[0] : $key[1];
                } else {
                    $code = $key;
                    $label = $labels[$key] ?? $key;
                }

                $data['options'][] = ['count' => $value->getCount(), 'value' => $code, 'label' => $label];
            }
        }

        // Sort options according to option position.
        if (BucketInterface::SORT_ORDER_MANUAL == $facetConfigs?->getSortOrder()) {
            $sourceFieldOptions = $sourceField->getOptions()->toArray();
            $sourceFieldOptions = array_combine(
                array_map(fn ($option) => $option->getCode(), $sourceFieldOptions),
                $sourceFieldOptions
            );
            $options = $data['options'];
            usort(
                $options,
                fn ($a, $b) => (isset($sourceFieldOptions[$a['value']]) ? $sourceFieldOptions[$a['value']]->getPosition() : 1) - (isset($sourceFieldOptions[$b['value']]) ? $sourceFieldOptions[$b['value']]->getPosition() : 1)
            );

            if (\count($options) > $facetConfigs->getMaxSize()) {
                $options = \array_slice($options, 0, $facetConfigs->getMaxSize());
                $data['hasMore'] = true;
            }
            $data['options'] = $options;
        }
    }
}
