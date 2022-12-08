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

namespace Elasticsuite\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Resolver\Stage\SerializeStageInterface;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Product\Service\CurrentCategoryProvider;
use Elasticsuite\Search\DataProvider\Paginator;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\BucketValueInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Document;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

/**
 * Add aggregations data in graphql search document response.
 */
class AddAggregationsData implements SerializeStageInterface
{
    public const AGGREGATION_TYPE_CHECKBOX = 'checkbox';
    public const AGGREGATION_TYPE_SLIDER = 'slider';

    public function __construct(
        private SerializeStageInterface $decorated,
        private MetadataRepository $metadataRepository,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private SourceFieldRepository $sourceFieldRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private ConfigurationRepository $facetConfigRepository,
        private CurrentCategoryProvider $currentCategoryProvider,
        private iterable $availableFilterTypes,
        private string $nestingSeparator,
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        $data = $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);

        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $metadata = $this->metadataRepository->findByEntity($context['args']['entityType']);
            $localizedCatalog = $this->localizedCatalogRepository->findByCodeOrId($context['args']['catalogId']);
            $containerConfig = $this->containerConfigurationProvider->get($metadata, $localizedCatalog, $context['args']['requestType'] ?? null);

            /** @var Paginator $itemOrCollection */
            $aggregations = $itemOrCollection->getAggregations();
            if (!empty($aggregations)) {
                $data['aggregations'] = [];
                foreach ($aggregations as $aggregation) {
                    $data['aggregations'][] = $this->formatAggregation($aggregation, $containerConfig);
                }
            }
        }

        return $data;
    }

    private function formatAggregation(AggregationInterface $aggregation, ContainerConfigurationInterface $containerConfig): array
    {
        $sourceField = $this->getSourceFieldFromAggregation($aggregation, $containerConfig);
        $currentCategory = $this->currentCategoryProvider->getCurrentCategory();
        $this->facetConfigRepository->setCategoryId($currentCategory?->getId());
        $this->facetConfigRepository->setMetadata($containerConfig->getMetadata());

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
                default => self::AGGREGATION_TYPE_CHECKBOX,
            },
            'count' => $aggregation->getCount(),
            'options' => null,
        ];

        $this->formatOptions($aggregation, $sourceField, $data);

        return $data;
    }

    private function getSourceFieldFromAggregation(AggregationInterface $aggregation, ContainerConfigurationInterface $containerConfig): ?SourceField
    {
        $sourceField = $this->sourceFieldRepository->findOneBy(
            ['code' => $aggregation->getField(), 'metadata' => $containerConfig->getMetadata()]
        );

        if (!$sourceField) {
            $sourceField = $this->sourceFieldRepository->findOneBy(
                ['code' => explode('.', $aggregation->getField())[0], 'metadata' => $containerConfig->getMetadata()]
            );
        }

        return $sourceField;
    }

    private function formatOptions(AggregationInterface $aggregation, ?SourceField $sourceField, array &$data)
    {
        if (!empty($aggregation->getValues())) {
            $data['options'] = [];
            $data['count'] = $aggregation->getCount();
            $data['hasMore'] = false;
        }
        $facetConfigs = $sourceField ? $this->facetConfigRepository->findOndBySourceField($sourceField) : null;

        foreach ($aggregation->getValues() as $value) {
            if ($value instanceof BucketValueInterface) {
                $key = $value->getKey();

                if (AggregationBuilder::OTHER_DOCS_KEY === $key) {
                    $data['hasMore'] = true;
                    continue;
                }

                if (\is_array($key)) {
                    $code = $key[1];
                    $label = 'None' !== $key[0] ? $key[0] : $key[1];
                } else {
                    $code = $key;
                    $label = $key;
                }

                $data['options'][] = [
                    'count' => $value->getCount(),
                    'value' => $code,
                    'label' => $label,
                ];
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
                $data['options'] = \array_slice($options, 0, $facetConfigs->getMaxSize());
                $data['hasMore'] = true;
            }
        }
    }
}
