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

namespace Elasticsuite\Product\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Product\GraphQl\Type\Definition\SortOrder\SortOrderProviderInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\SortInputType as SearchSortInputType;

class SortInputType extends SearchSortInputType
{
    public const NAME = 'ProductSortInput';

    public function __construct(
        private TypeInterface $sortEnumType,
        private SourceFieldRepository $sourceFieldRepository,
        private iterable $sortOrderProviders,
        private string $nestingSeparator
    ) {
        parent::__construct($this->sortEnumType);
        $this->name = self::NAME;
    }

    public function getConfig(): array
    {
        $fields = [];
        foreach ($this->sourceFieldRepository->getSortableFields('product') as $sortableField) {
            /** @var SortOrderProviderInterface $sortOrderProvider */
            foreach ($this->sortOrderProviders as $sortOrderProvider) {
                if ($sortOrderProvider->supports($sortableField)) {
                    $fieldName = $sortOrderProvider->getSortOrderField($sortableField);
                    $fields[$fieldName] = [
                        'type' => $this->sortEnumType,
                        'description' => $sortOrderProvider->getLabel($sortableField),
                    ];
                }
            }
        }

        $fields[SortOrderInterface::DEFAULT_SORT_FIELD] = [
            'type' => $this->sortEnumType,
            'description' => 'Product relevance according to context (_score)',
        ];

        return ['fields' => $fields];
    }

    public function validateSort(array &$context): void
    {
        if (!\array_key_exists('sort', $context['filters'])) {
            return;
        }

        foreach (array_keys($context['filters']['sort']) as $field) {
            if (str_contains($field, $this->nestingSeparator)) {
                unset($context['filters']['sort'][$field]);
            }
        }

        if (\count($context['filters']['sort']) > 1) {
            throw new \InvalidArgumentException('Sort argument : You can\'t sort on multiple attribute.');
        }
    }

    public function formatSort($context): ?array
    {
        if (!\array_key_exists('sort', $context['filters'])) {
            return [];
        }

        return array_map(
            fn ($direction) => ['direction' => $direction],
            $context['filters']['sort']
        );
    }
}
