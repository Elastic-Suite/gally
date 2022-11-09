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
use Elasticsuite\Index\Api\IndexSettingsInterface;
use Elasticsuite\Index\Service\MetadataManager;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationFactoryInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;

class GenericContainerConfigurationFactory implements ContainerConfigurationFactoryInterface
{
    public function __construct(
        private IndexSettingsInterface $indexSettings,
        private MetadataManager $metadataManager,
        private RelevanceConfigurationInterface $relevanceConfiguration,
        private AggregationProviderInterface $aggregationProvider,
    ) {
    }

    public function create(string $requestType, Metadata $metadata, LocalizedCatalog $localizedCatalog): ContainerConfigurationInterface
    {
        $indexName = $this->indexSettings->getIndexAliasFromIdentifier(
            $metadata->getEntity(),
            $localizedCatalog->getId()
        );
        $mapping = $this->metadataManager->getMapping($metadata);

        return new GenericContainerConfiguration(
            $requestType,
            $localizedCatalog,
            $metadata,
            $indexName,
            $mapping,
            $this->relevanceConfiguration,
            $this->aggregationProvider,
        );
    }
}
