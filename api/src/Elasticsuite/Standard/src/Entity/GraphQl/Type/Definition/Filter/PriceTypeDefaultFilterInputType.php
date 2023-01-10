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

namespace Elasticsuite\Entity\GraphQl\Type\Definition\Filter;

use Elasticsuite\Entity\Service\PriceGroupProvider;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Search\Constant\FilterOperator;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Service\ReverseSourceFieldProvider;
use GraphQL\Type\Definition\Type;

class PriceTypeDefaultFilterInputType extends FloatTypeFilterInputType
{
    public const SPECIFIC_NAME = 'PriceTypeDefaultFilterInputType';

    public $name = self::SPECIFIC_NAME;

    public function __construct(
        FilterQueryBuilder $filterQueryBuilder,
        QueryFactory $queryFactory,
        protected PriceGroupProvider $priceGroupProvider,
        protected ReverseSourceFieldProvider $reverseSourceFieldProvider,
        string $nestingSeparator
    ) {
        parent::__construct($filterQueryBuilder, $queryFactory, $nestingSeparator);
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                FilterOperator::EQ => Type::float(),
                FilterOperator::IN => Type::listOf(Type::float()),
                FilterOperator::GTE => Type::float(),
                FilterOperator::GT => Type::float(),
                FilterOperator::LT => Type::float(),
                FilterOperator::LTE => Type::float(),
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function supports(SourceField $sourceField): bool
    {
        return SourceField\Type::TYPE_PRICE === $sourceField->getType();
    }

    /**
     * {@inheritDoc}
     */
    public function getFilterFieldName(string $sourceFieldCode): string
    {
        return $sourceFieldCode . '.price';
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($inputFilter['field'], $containerConfig->getMetadata());
        if (null === $sourceField) {
            throw new \InvalidArgumentException("The source field for the filter '{$inputFilter['field']}' does not exist");
        }
        $priceQuery = $this->filterQueryBuilder->create($containerConfig, $this->getFilterData($inputFilter), $sourceField->getCode());

        return $this->queryFactory->create(
            QueryInterface::TYPE_NESTED,
            [
                'path' => $sourceField->getCode(),
                'query' => $this->queryFactory->create(
                    QueryInterface::TYPE_BOOL,
                    [
                        'must' => [
                            $this->queryFactory->create(
                                QueryInterface::TYPE_TERM,
                                ['field' => $sourceField->getCode() . '.group_id', 'value' => $this->priceGroupProvider->getCurrentPriceGroupId()]
                            ),
                            $priceQuery,
                        ],
                    ]
                ),
            ]
        );
    }
}
