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

namespace Elasticsuite\Search\DataProvider\Facet;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Search\Model\Facet;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

final class ConfigurationCollectionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(
        private ManagerRegistry $managerRegistry,
        private ContextAwareCollectionDataProviderInterface $collectionDataProvider)
    {
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
            $category = (int) end($category);
            unset($context['filters']['category']);
        }

        $repository->setCategoryId($category);

        return $this->collectionDataProvider->getCollection($resourceClass, $operationName, $context);
    }
}
