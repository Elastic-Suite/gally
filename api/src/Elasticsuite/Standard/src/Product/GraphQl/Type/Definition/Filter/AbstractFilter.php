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

namespace Elasticsuite\Product\GraphQl\Type\Definition\Filter;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use GraphQL\Type\Definition\InputObjectType;

abstract class AbstractFilter extends InputObjectType implements TypeInterface, FilterInterface
{
    public function __construct(
        protected FilterQueryBuilder $filterQueryBuilder,
        private QueryFactory $queryFactory,
        private string $nestingSeparator,
    ) {
        parent::__construct($this->getConfig());
    }

    abstract public function getConfig(): array;

    public function getName(): string
    {
        return $this->name;
    }

    public function getGraphQlFieldName(string $mappingFieldName): string
    {
        return str_replace('.', $this->nestingSeparator, $mappingFieldName);
    }

    public function getMappingFieldName(string $graphqlFieldName): string
    {
        return str_replace($this->nestingSeparator, '.', $graphqlFieldName);
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface
    {
        if (isset($inputFilter['exist'])) {
            $existQuery = $this->queryFactory->create(QueryInterface::TYPE_EXISTS, $inputFilter);

            return $inputFilter['exist']
                ? $existQuery
                : $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['mustNot' => [$existQuery]]);
        }

        $conditions = [];
        foreach ($this->getConditions() as $condition) {
            if (isset($inputFilter[$condition])) {
                if (\is_array($inputFilter[$condition])) {
                    $inputFilter[$condition] = array_map(fn ($item) => "$item", $inputFilter[$condition]);
                } else {
                    $inputFilter[$condition] = "$inputFilter[$condition]";
                }
                $conditions = array_merge($conditions, [$condition => $inputFilter[$condition]]);
            }
        }
        $filterData = [$this->getMappingFieldName($inputFilter['field']) => $conditions];

        return $this->filterQueryBuilder->create($containerConfig, $filterData);
    }

    protected function getConditions(): array
    {
        return array_keys($this->getConfig()['fields']);
    }
}
