<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Index\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Index\Dto\CreateIndexInput;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Service\IndexOperation;
use Elasticsuite\Metadata\Repository\MetadataRepository;

class CreateIndexInputDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private MetadataRepository $metadataRepository,
        private IndexOperation $indexOperation,
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
        // if it's an index we transformed the data already
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
        $localizedCatalogCode = $object->localizedCatalog;

        $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
        if (!$metadata) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
        }
        if (null === $metadata->getEntity()) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] is not defined', $entityType));
        }

        $catalog = $this->localizedCatalogRepository->findByCodeOrId($localizedCatalogCode);
        if (null === $catalog) {
            throw new InvalidArgumentException(sprintf('Localized catalog of ID or code [%s] does not exist', $localizedCatalogCode));
        }

        try {
            $index = $this->indexOperation->createIndex($metadata, $catalog);
        } catch (\Exception $exception) {
            // TODO log error
            throw new \Exception('An error occurred when creating the index');
        }

        return $index;
    }
}
