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

namespace Elasticsuite\Category\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Elasticsuite\Category\Model\Source\CategorySortingOption;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;

class CategorySortingOptionDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(private SourceFieldRepository $sourceFieldRepository)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return CategorySortingOption::class === $resourceClass;
    }

    /**
     * {@inheritDoc}
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): array
    {
        $sortOptions = [
            ['code' => 'position', 'label' => 'Position'],
        ];
        $sortableFields = $this->sourceFieldRepository->getSortableFields('product');

        foreach ($sortableFields as $sourceField) {
            $sortOptions[] = [
                'code' => $sourceField->getCode(),
                'label' => $sourceField->getDefaultLabel(),
            ];
        }

        return $sortOptions;
    }
}
