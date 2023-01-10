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

namespace Gally\Search\Elasticsearch\Request\Container\Configuration;

use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Metadata\Model\Metadata;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationFactoryInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;

class ContainerConfigurationProvider
{
    /** @var ContainerConfigurationFactoryInterface[][] */
    private array $containerConfigFactories;

    /**
     * Add factories via compiler pass.
     *
     * @see \Gally\Search\Compiler\GetContainerConfigurationFactory
     */
    public function addContainerConfigFactory(
        string $requestType,
        ContainerConfigurationFactoryInterface $configurationFactory,
        string $entityCode = 'generic'
    ): void {
        $this->containerConfigFactories[$entityCode][$requestType] = $configurationFactory;
    }

    /**
     * Create a container configuration based on provided entity metadata and catalog ID.
     *
     * @param Metadata         $metadata         Search request target entity metadata
     * @param LocalizedCatalog $localizedCatalog Search request target catalog
     * @param string|null      $requestType      Search request type
     *
     * @throws \LogicException Thrown when the search container is not found into the configuration
     */
    public function get(Metadata $metadata, LocalizedCatalog $localizedCatalog, ?string $requestType = null): ContainerConfigurationInterface
    {
        $requestType = $requestType ?: 'generic';
        $entityCode = $metadata->getEntity();

        if (!\array_key_exists($entityCode, $this->containerConfigFactories)) {
            $entityCode = 'generic';
        }

        // Check if the requested requestType is defined for this entity code
        if (\array_key_exists($requestType, $this->containerConfigFactories[$entityCode])) {
            return $this->containerConfigFactories[$entityCode][$requestType]->create($requestType, $metadata, $localizedCatalog);
        }

        // If not, we check if the requested requestType is defined for the generic entityType to fallback on it if it exists.
        if (\array_key_exists($requestType, $this->containerConfigFactories['generic'])) {
            return $this->containerConfigFactories['generic'][$requestType]->create($requestType, $metadata, $localizedCatalog);
        }

        throw new \LogicException(sprintf('The request type %s is not defined.', $requestType));
    }

    /**
     * Get all available request type names.
     *
     * @return string[]
     */
    public function getAvailableRequestType(string $entityCode = 'generic'): array
    {
        return array_keys($this->containerConfigFactories[$entityCode]);
    }
}
