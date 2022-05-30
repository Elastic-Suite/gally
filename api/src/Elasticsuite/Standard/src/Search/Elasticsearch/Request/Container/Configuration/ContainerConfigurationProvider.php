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
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationFactoryInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;

class ContainerConfigurationProvider
{
    public function __construct(
        private IndexSettingsInterface $indexSettings,
        private MetadataManager $metadataManager,
        private ContainerConfigurationFactoryInterface $containerConfigFactory,
    ) {
    }

    /**
     * Create a container configuration based on provided entity metadata and catalog ID.
     *
     * @param Metadata         $metadata Search request target entity metadata
     * @param LocalizedCatalog $catalog  Search request target catalog
     *
     * @throws \LogicException Thrown when the search container is not found into the configuration
     */
    public function get(Metadata $metadata, LocalizedCatalog $catalog): ContainerConfigurationInterface
    {
        $indexName = $this->indexSettings->getIndexAliasFromIdentifier(
            $metadata->getEntity(),
            $catalog->getId()
        );

        $mapping = $this->metadataManager->getMapping($metadata);

        return $this->containerConfigFactory->create([
            'containerName' => 'raw',
            'indexName' => $indexName,
            'catalog' => $catalog,
            'metadata' => $metadata,
            'mapping' => $mapping,
        ]);
    }
}
