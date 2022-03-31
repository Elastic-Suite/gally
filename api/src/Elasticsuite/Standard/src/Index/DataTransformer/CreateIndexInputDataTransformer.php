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

namespace Elasticsuite\Index\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Dto\CreateIndexInput;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Index\Repository\Metadata\MetadataRepository;
use Elasticsuite\Index\Service\IndexManager;
use Elasticsuite\Index\Service\IndexSettings;

class CreateIndexInputDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private IndexRepositoryInterface $indexRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private MetadataRepository $metadataRepository,
        private IndexSettings $indexSettings,
        private IndexManager $indexManager
    ) {
    }

    /**
     * @param object|array<mixed> $data    object on normalize / array on denormalize
     * @param string              $to      target class
     * @param array<mixed>        $context context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        // in the case of an input, the value given here is an array (the JSON decoded).
        // if it's a book we transformed the data already
        if ($data instanceof Index) {
            return false;
        }

        return Index::class === $to && CreateIndexInput::class === ($context['input']['class'] ?? null);
    }

    /**
     * @param CreateIndexInput $object  input object
     * @param string           $to      target class
     * @param array<mixed>     $context context
     *
     * @throws \Exception
     *
     * @return Index|null
     */
    public function transform($object, string $to, array $context = [])
    {
        $entityType = $object->entityType;
        $catalogId = $object->catalog;

        $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
        if (!$metadata) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
        }
        if (null === $metadata->getEntity()) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] is not defined', $entityType));
        }

        $catalog = $this->catalogRepository->find($catalogId);
        if (!$catalog) {
            throw new InvalidArgumentException(sprintf('Catalog of ID [%s] does not exist', $catalogId));
        }

        $indexSettings = [
            'settings' => $this->indexSettings->getCreateIndexSettings() + $this->indexSettings->getDynamicIndexSettings($catalog),
        ];
        $indexSettings['settings']['analysis'] = $this->indexSettings->getAnalysisSettings($catalog);
        $indexSettings['mappings'] = $this->indexManager->getMapping($metadata)->asArray();
        try {
            $index = $this->indexRepository->create(
                $this->indexSettings->createIndexNameFromIdentifier($metadata->getEntity(), $catalog),
                $indexSettings
            );
        } catch (\Exception $exception) {
            // TODO log error
            throw new \Exception('An error occurred when creating the index');
        }

        return $index;
    }
}
