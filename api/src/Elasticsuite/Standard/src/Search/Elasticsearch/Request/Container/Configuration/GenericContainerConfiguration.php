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
use Elasticsuite\Index\Model\Index\MappingInterface;
use Elasticsuite\Metadata\Model\Metadata;
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
        private AggregationProviderInterface $aggregationProvider,
    ) {
        $this->relevanceConfiguration->initConfigData($this->localizedCatalog, $this->requestType);
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
        return $this->aggregationProvider->getAggregations($this, $query, $filters, $queryFilters);
    }

    /**
     * {@inheritDoc}
     */
    public function getTrackTotalHits(): int|bool
    {
        return true;
    }
}
