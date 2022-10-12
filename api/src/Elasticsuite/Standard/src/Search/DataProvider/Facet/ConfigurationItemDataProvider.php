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

use ApiPlatform\Core\DataProvider\DenormalizedIdentifiersAwareItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Elasticsuite\Category\Model\Category;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Model\Facet;
use Elasticsuite\Search\Repository\Facet\ConfigurationRepository;

final class ConfigurationItemDataProvider implements RestrictedDataProviderInterface, DenormalizedIdentifiersAwareItemDataProviderInterface
{
    public function __construct(
        private ManagerRegistry $managerRegistry,
        private DenormalizedIdentifiersAwareItemDataProviderInterface $itemDataProviderNoEagerLoading,
        private DenormalizedIdentifiersAwareItemDataProviderInterface $itemDataProvider
    ) {
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Facet\Configuration::class === $resourceClass;
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = [])
    {
        [$sourceFieldId, $categoryId] = explode('-', $id['id']);
        /** @var EntityManagerInterface $manager */
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        /** @var ConfigurationRepository $repository */
        $repository = $manager->getRepository($resourceClass);

        // Force loading sub-entity in order to avoid having proxies.
        /** @var SourceField $sourceField */
        $sourceField = $this->itemDataProvider->getItem(SourceField::class, ['id' => $sourceFieldId]);
        /** @var Category $category */
        $category = $this->itemDataProvider->getItem(Category::class, ['id' => $categoryId]);

        $defaultFacetConfiguration = null;
        if ($categoryId
            && (
                ('get' === ($context['item_operation_name'] ?? null))
                || ('item_query' === ($context['graphql_operation_name'] ?? null))
            )
        ) {
            $repository->setCategoryId(null);
            $defaultFacetConfiguration = $this->itemDataProviderNoEagerLoading->getItem(
                Facet\Configuration::class,
                ['id' => implode('-', [$sourceFieldId, 0])],
                $operationName,
                $context
            );
        }

        if (!$defaultFacetConfiguration) {
            $defaultFacetConfiguration = new Facet\Configuration($sourceField, null);
        }

        $repository->setCategoryId($categoryId);
        $defaultFacetConfiguration->setSourceField($sourceField);
        $defaultFacetConfiguration->setCategory($category);

        $facetConfiguration = $this->itemDataProviderNoEagerLoading->getItem(
            Facet\Configuration::class,
            $id,
            $operationName,
            $context
        );
        $facetConfiguration = $facetConfiguration ?: new Facet\Configuration($sourceField, $category);

        $facetConfiguration->initDefaultValue($defaultFacetConfiguration);

        return $facetConfiguration;
    }
}
