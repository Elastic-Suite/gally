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

namespace Elasticsuite\Category\Service;

use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Product\GraphQl\Type\Definition\SortOrder\SortOrderProviderInterface as ProductSortOrderProviderInterface;

class CategoryProductsSortingOptionsProvider
{
    private ?array $sortingOptions;

    public function __construct(
        private SourceFieldRepository $sourceFieldRepository,
        private iterable $sortOrderProviders
    ) {
        $this->sortingOptions = null;
    }

    /**
     * Return all products sorting options for categories.
     */
    public function getAllSortingOptions(): array
    {
        if (null === $this->sortingOptions) {
            $sortOptions = [];

            $sortableFields = $this->sourceFieldRepository->getSortableFields('product');
            foreach ($sortableFields as $sourceField) {
                /** @var ProductSortOrderProviderInterface $sortOrderProvider */
                foreach ($this->sortOrderProviders as $sortOrderProvider) {
                    if ($sortOrderProvider->supports($sourceField)) {
                        $sortOptions[] = [
                            'code' => $sortOrderProvider->getSortOrderField($sourceField),
                            'label' => $sortOrderProvider->getSimplifiedLabel($sourceField),
                        ];
                    }
                }
            }

            $this->sortingOptions = $sortOptions;
        }

        return $this->sortingOptions;
    }

    /**
     * Return the default sorting field.
     */
    public function getDefaultSortingField(): ?string
    {
        $defaultSortingField = null;

        $defaultSortOption = current($this->getAllSortingOptions());
        if (\is_array($defaultSortOption) && \array_key_exists('code', $defaultSortOption)) {
            $defaultSortingField = $defaultSortOption['code'];
        }

        return $defaultSortingField;
    }
}
