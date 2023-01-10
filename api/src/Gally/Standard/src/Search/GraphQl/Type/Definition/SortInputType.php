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

namespace Gally\Search\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Gally\Entity\Service\PriceGroupProvider;
use Gally\Metadata\Model\Metadata;
use Gally\Metadata\Model\SourceField\Type;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;
use Gally\Search\Service\ReverseSourceFieldProvider;
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
