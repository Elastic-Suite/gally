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

namespace Elasticsuite\Search\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\Entity\Service\PriceGroupProvider;
use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField\Type;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Elasticsuite\Search\Service\ReverseSourceFieldProvider;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type as GraphQLType;

class SortInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'SortInput';

    public function __construct(
        private TypeInterface $sortEnumType,
        protected PriceGroupProvider $priceGroupProvider,
        protected ReverseSourceFieldProvider $reverseSourceFieldProvider,
    ) {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'field' => GraphQLType::nonNull(GraphQLType::string()),
                'direction' => $this->sortEnumType,
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }

    public function formatSort(ContainerConfigurationInterface $containerConfig, mixed $context, Metadata $metadata): ?array
    {
        if (!\array_key_exists('sort', $context['filters'])) {
            return $containerConfig->getDefaultSortingOption();
        }

        $field = $context['filters']['sort']['field'];
        $direction = $context['filters']['sort']['direction'] ?? SortOrderInterface::DEFAULT_SORT_DIRECTION;

        return $this->addNestedFieldData([$field => ['direction' => $direction]], $metadata);
    }

    public function addNestedFieldData(array $sortOrders, Metadata $metadata): array
    {
        foreach ($sortOrders as $sortField => &$sortParams) {
            $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($sortField, $metadata);

            if (Type::TYPE_PRICE == $sourceField?->getType()) {
                $sortParams['nestedPath'] = $sourceField->getCode();
                $sortParams['nestedFilter'] = [$sourceField->getCode() . '.group_id' => $this->priceGroupProvider->getCurrentPriceGroupId()];
            }
        }

        return $sortOrders;
    }
}
