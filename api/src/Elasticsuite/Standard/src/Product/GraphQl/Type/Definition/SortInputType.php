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

use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\GraphQl\Type\Definition\SortInputType as SearchSortInputType;

class SortInputType extends SearchSortInputType
{
    public const NAME = 'ProductSortInput';

    public function __construct(
        TypesContainerInterface $typesContainer,
        private SourceFieldRepository $sourceFieldRepository,
        private string $nestingSeparator,
    ) {
        parent::__construct($typesContainer);
        $this->name = self::NAME;
    }

    public function getConfig(): array
    {
        $fields = [];
        foreach ($this->sourceFieldRepository->getSortableFields('product') as $sortableField) {
            if (
                \in_array(
                    $sortableField->getType(),
                    [
                        Type::TYPE_TEXT,
                        Type::TYPE_KEYWORD,
                        Type::TYPE_INT,
                        Type::TYPE_BOOLEAN,
                        Type::TYPE_FLOAT,
                        Type::TYPE_REFERENCE,
                        Type::TYPE_DATE,
                    ], true
                )
            ) {
                // GraphQl don't accept '.' in field name.
                $fieldName = str_replace('.', $this->nestingSeparator, $sortableField->getCode());
                $fields[$fieldName] = $this->getSortEnumType();
            }
        }

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
