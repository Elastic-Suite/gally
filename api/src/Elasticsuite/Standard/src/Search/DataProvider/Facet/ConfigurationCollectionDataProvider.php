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

namespace Elasticsuite\Search\DataProvider\Facet;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Search\Model\Facet;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

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
