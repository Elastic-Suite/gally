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

namespace Elasticsuite\Search\Elasticsearch\Request\Container\Configuration;

use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Index\Model\Index\MappingInterface;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Search\Elasticsearch\Request;
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

class GenericContainerConfiguration implements ContainerConfigurationInterface
{
    public function __construct(
        private string $requestType,
        private LocalizedCatalog $localizedCatalog,
        private Metadata $metadata,
        private string $indexName,
        private MappingInterface $mapping,
        private RelevanceConfigurationInterface $relevanceConfiguration,
    ) {
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->requestType;
    }

    /**
     * {@inheritDoc}
     */
    public function getIndexName(): string
    {
        return $this->indexName;
    }

    /**
     * {@inheritDoc}
     */
    public function getLabel(): string
    {
        return $this->getName();
    }

    /**
     * {@inheritDoc}
     */
    public function getMapping(): MappingInterface
    {
        return $this->mapping;
    }

    /**
     * {@inheritDoc}
     */
    public function getRelevanceConfig(): RelevanceConfigurationInterface
    {
        return $this->relevanceConfiguration;
    }

    /**
     * {@inheritDoc}
     */
    public function getLocalizedCatalog(): LocalizedCatalog
    {
        return $this->localizedCatalog;
    }

    /**
     * {@inheritDoc}
     */
    public function getMetadata(): Metadata
    {
        return $this->metadata;
    }

    /**
     * {@inheritDoc}
     */
    public function getFilters(): array
    {
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function getAggregations(QueryInterface|string|null $query = null, array $filters = [], array $queryFilters = []): array
    {
        $aggregations = [];

        foreach ($this->getMapping()->getFields() as $field) {
            if ($field->isFilterable()) {
                $aggregationConfig = $this->getAggregationConfig($field);
                if (!empty($aggregationConfig) && isset($aggregationConfig['name'])) {
                    $aggregations[$aggregationConfig['name']] = $aggregationConfig;
                }
            }
        }

        return $aggregations;
    }

    /**
     * {@inheritDoc}
     */
    public function getTrackTotalHits(): int|bool
    {
        return true;
    }

    private function getAggregationConfig(FieldInterface $field): array
    {
        return match ($field->getType()) {
            FieldInterface::FIELD_TYPE_DOUBLE, FieldInterface::FIELD_TYPE_LONG, FieldInterface::FIELD_TYPE_INTEGER => [
                'name' => $field->getName(),
                'type' => Request\BucketInterface::TYPE_HISTOGRAM,
                'minDocCount' => 1,
                'size' => 2, //TODO remove
            ],
            FieldInterface::FIELD_TYPE_DATE => [
                'name' => $field->getName(),
                'type' => Request\BucketInterface::TYPE_DATE_HISTOGRAM,
                'minDocCount' => 1,
            ],
            default => [
                'name' => $field->getName(),
                'type' => Request\BucketInterface::TYPE_TERMS,
            ],
        };
    }
}
