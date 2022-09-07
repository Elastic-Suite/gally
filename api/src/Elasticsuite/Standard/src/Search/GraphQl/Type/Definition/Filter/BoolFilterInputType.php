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
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class BoolFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    public const NAME = 'BoolFilterInput';

    public $name = self::NAME;

    private array $mappedBooleanConditions = [
        '_must' => 'must',
        '_should' => 'should',
        '_not' => 'mustNot',
    ];

    public function __construct(
        private FieldFilterInputType $fieldFilterInputType,
        private QueryFactory $queryFactory,
    ) {
        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                '_must' => fn () => Type::listOf($this->fieldFilterInputType),
                '_should' => fn () => Type::listOf($this->fieldFilterInputType),
                '_not' => fn () => Type::listOf($this->fieldFilterInputType),
            ],
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function validate(string $argName, mixed $inputData): array
    {
        $errors = [];

        if (isset($inputData['_must'])) {
            $errors = array_merge($errors, $this->fieldFilterInputType->validate($argName, $inputData['_must']));
        }

        if (isset($inputData['_should'])) {
            $errors = array_merge($errors, $this->fieldFilterInputType->validate($argName, $inputData['_should']));
        }

        if (isset($inputData['_not'])) {
            $errors = array_merge($errors, $this->fieldFilterInputType->validate($argName, $inputData['_not']));
        }

        return $errors;
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface
    {
        $queryParams = [];
        foreach (array_keys($this->mappedBooleanConditions) as $param) {
            if (isset($inputFilter[$param])) {
                $queries = [];
                foreach ($inputFilter[$param] as $filter) {
                    $queries[] = $this->fieldFilterInputType->transformToElasticsuiteFilter($filter, $containerConfig);
                }
                $queryParams[$this->mappedBooleanConditions[$param]] = $queries;
            }
        }

        return $this->queryFactory->create(QueryInterface::TYPE_BOOL, $queryParams);
    }
}
