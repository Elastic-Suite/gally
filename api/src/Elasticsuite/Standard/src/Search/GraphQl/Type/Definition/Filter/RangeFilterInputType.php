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

namespace Elasticsuite\Search\GraphQl\Type\Definition\Filter;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\GraphQl\Type\Definition\FilterInterface;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;
use Elasticsuite\Search\Constant\FilterOperator;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class RangeFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    use FilterableFieldTrait;

    public const NAME = 'RangeFilterInput';

    public function __construct(
        private FilterQueryBuilder $filterQueryBuilder,
        private SourceFieldRepository $sourceFieldRepository,
    ) {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'field' => ['type' => Type::nonNull(Type::string())],
                FilterOperator::GTE => Type::string(),
                FilterOperator::LTE => Type::string(),
                FilterOperator::GT => Type::string(),
                FilterOperator::LT => Type::string(),
            ],
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = $this->validateIsFilterable($inputData['field']);

        if (\count($inputData) < 2) {
            $errors[] = sprintf(
                "Filter argument %s: At least '%s', '%s', '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::GT,
                FilterOperator::LT,
                FilterOperator::GTE,
                FilterOperator::LTE,
            );
        }

        if (isset($inputData[FilterOperator::GT]) && isset($inputData[FilterOperator::GTE])) {
            $errors[] = sprintf(
                "Filter argument %s: Do not use '%s' and '%s' in the same filter.",
                $argName,
                FilterOperator::GT,
                FilterOperator::GTE,
            );
        }

        if (isset($inputData[FilterOperator::LT]) && isset($inputData[FilterOperator::LTE])) {
            $errors[] = sprintf(
                "Filter argument %s: Do not use '%s' and '%s' in the same filter.",
                $argName,
                FilterOperator::LT,
                FilterOperator::LTE,
            );
        }

        return $errors;
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        $conditions = [];
        foreach ([FilterOperator::GT, FilterOperator::LT, FilterOperator::GTE, FilterOperator::LTE] as $condition) {
            if (isset($inputFilter[$condition])) {
                $conditions = array_merge($conditions, [$condition => $inputFilter[$condition]]);
            }
        }

        $filterData = [
            $inputFilter['field'] => $conditions,
        ];

        return $this->filterQueryBuilder->create($containerConfig, $filterData);
    }
}
