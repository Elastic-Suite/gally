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

namespace Gally\Index\Service;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Index\Model\Index;
use Gally\Index\Model\Index\SelfReindex;
use Gally\Index\Repository\Index\IndexRepositoryInterface;
use Gally\Metadata\Model\Metadata;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;

class SelfReindexOperation
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private IndexOperation $indexOperation,
        private IndexRepositoryInterface $indexRepository,
        private ContainerConfigurationProvider $containerConfigurationProvider
    ) {
    }

    /**
     * Perform a live reindex of a given or all entities indices.
     *
     * @param string|null $entityType Entity type to reindex, if empty all entities indices will be reindexed
     *
     * @throws \Exception
     *
     * @return SelfReindex
     */
    public function performReindex(?string $entityType = null): Index\SelfReindex
    {
        if (!empty($entityType)) {
            $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
            if (!$metadata) {
                throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
            }
            $metadataToReindex = [$metadata];
        } else {
            $metadataToReindex = $this->metadataRepository->findAll();
        }

        $selfReindex = new Index\SelfReindex();

        $selfReindex->setEntityTypes(array_map(function (Metadata $entityMetadata) { return $entityMetadata->getEntity(); }, $metadataToReindex));
        $selfReindex->setStatus(SelfReindex::STATUS_PROCESSING);

        try {
            $indices = $this->reindexEntities($metadataToReindex);
        } catch (\Exception $e) {
            // TODO log error
            $selfReindex->setStatus(SelfReindex::STATUS_FAILURE);
            throw new \Exception('An error occurred when creating the index');
        }

        $selfReindex->setIndexNames(array_map(function (Index $index) { return $index->getName(); }, $indices));
        $selfReindex->setStatus(SelfReindex::STATUS_SUCCESS);

        return $selfReindex;
    }

    /**
     * Reindex entity index for a list of given entities or all of them for all localized catalogs.
     *
     * @param Metadata[] $metadata     Entities metadata
     * @param bool       $asynchronous Whether to use asynchronous (non-blocking) mode or not
     */
    public function reindexEntities(array $metadata = [], bool $asynchronous = false): array
    {
        $newIndices = [];

        if (empty($metadata)) {
            $metadata = $this->metadataRepository->findAll();
        }

        $localizedCatalogs = $this->catalogRepository->findAll();

        foreach ($metadata as $metadatum) {
            foreach ($localizedCatalogs as $localizedCatalog) {
                $newIndex = $this->indexOperation->createIndex($metadatum, $localizedCatalog);

                $containerConfig = $this->containerConfigurationProvider->get($metadatum, $localizedCatalog);
                $liveIndex = $this->indexRepository->findByName($containerConfig->getIndexName());
                if ($liveIndex instanceof Index) {
                    // Do reindex data.
                    $this->indexRepository->reindex($liveIndex->getName(), $newIndex->getName(), $asynchronous);
                }

                if (false === $asynchronous) {
                    $this->indexOperation->installIndexByName($newIndex->getName());
                }

                $newIndices[] = $newIndex;
            }
        }

        return $newIndices;
    }
}
