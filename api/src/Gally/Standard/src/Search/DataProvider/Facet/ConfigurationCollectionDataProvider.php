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

namespace Gally\Search\DataProvider\Facet;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Model\Facet;
use Gally\Search\Repository\Facet\ConfigurationRepository;

final class ConfigurationCollectionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private ManagerRegistry $managerRegistry,
        private ContextAwareCollectionDataProviderInterface $collectionDataProvider,
        private MetadataRepository $metadataRepository,
    ) {
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Facet\Configuration::class === $resourceClass;
    }

    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): iterable
    {
        /** @var EntityManagerInterface $manager */
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        /** @var ConfigurationRepository $repository */
        $repository = $manager->getRepository($resourceClass);
        $category = null;

        // Manually manage category filter to load default value if no category is selected.
        if (isset($context['filters']['category'])) {
            $category = explode('/', $context['filters']['category']);
            $category = end($category);
            unset($context['filters']['category']);
        }
        // Manually manage entityType in order to manage sub entity link.
        if (isset($context['filters']['sourceField.metadata.entity'])) {
            $entityType = $context['filters']['sourceField.metadata.entity'];
            unset($context['filters']['sourceField.metadata.entity']);
            unset($context['filters']['sourceField__metadata__entity']);
            $repository->setMetadata($this->metadataRepository->findByEntity($entityType));
        }
        // Manually manage search filter in order to manage sub entity link.
        if (isset($context['filters']['search'])) {
            $search = $context['filters']['search'];
            unset($context['filters']['search']);
            $repository->setSearch($search);
        }

        $repository->setCategoryId($category);

        return $this->collectionDataProvider->getCollection($resourceClass, $operationName, $context);
    }
}
