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

namespace Elasticsuite\Index\MutationResolver;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Exception\LogicException;
use Elasticsuite\Index\Service\IndexOperation;
use Elasticsuite\Metadata\Repository\MetadataRepository;

class CreateIndexMutation implements MutationResolverInterface
{
    public function __construct(
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private MetadataRepository $metadataRepository,
        private IndexOperation $indexOperation,
    ) {
    }

    /**
     * Handle mutation.
     *
     * @param object|null  $item    The item to be mutated
     * @param array<mixed> $context Context
     *
     * @throws \Exception
     *
     * @return object|null The mutated item
     */
    public function __invoke($item, array $context)
    {
        $entityType = $context['args']['input']['entityType'];
        $localizedCatalogCode = $context['args']['input']['localizedCatalog'];

        $metadata = $this->metadataRepository->findOneBy(['entity' => $entityType]);
        if (!$metadata) {
            throw new InvalidArgumentException(sprintf('Entity type [%s] does not exist', $entityType));
        }
        if (null === $metadata->getEntity()) {
            throw new LogicException(sprintf('Entity type [%s] is not defined', $entityType));
        }

        $catalog = $this->localizedCatalogRepository->findByCodeOrId($localizedCatalogCode);
        if (!$catalog) {
            throw new InvalidArgumentException(sprintf('Localized catalog of ID or code [%s] does not exist', $localizedCatalogCode));
        }

        try {
            $item = $this->indexOperation->createIndex($metadata, $catalog);
        } catch (\Exception $e) {
            // TODO log error
            throw new \Exception('An error occurred when creating the index');
        }

        return $item;
    }
}
