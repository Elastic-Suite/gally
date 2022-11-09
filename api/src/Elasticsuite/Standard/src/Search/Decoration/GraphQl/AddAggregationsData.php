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
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\DataProvider\Paginator;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\BucketValueInterface;
use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Model\Document;

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
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        $data = $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);

        if (Document::class === $resourceClass) {
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
        $sourceField = $this->sourceFieldRepository->findOneBy(
            [
                'code' => $aggregation->getField(),
                'metadata' => $containerConfig->getMetadata(),
            ]
        );

        $data = [
            'field' => $sourceField ? $sourceField->getCode() : $aggregation->getField(),
            'label' => $sourceField ? $sourceField->getLabel($containerConfig->getLocalizedCatalog()->getId()) : $aggregation->getField(),
            'type' => match ($sourceField?->getType()) {
                Type::TYPE_PRICE, Type::TYPE_FLOAT, Type::TYPE_INT => self::AGGREGATION_TYPE_SLIDER,
                default => self::AGGREGATION_TYPE_CHECKBOX,
            },
            'count' => $aggregation->getCount(),
            'options' => null,
        ];
        if (!empty($aggregation->getValues())) {
            $data['options'] = [];
            $data['count'] = 0;
        }
        foreach ($aggregation->getValues() as $value) {
            if ($value instanceof BucketValueInterface) {
                $key = $value->getKey();

                if (\is_array($key)) {
                    $code = $key[0];
                    $label = 'None' !== $key[1] ? $key[1] : $key[0];
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

        return $data;
    }
}
