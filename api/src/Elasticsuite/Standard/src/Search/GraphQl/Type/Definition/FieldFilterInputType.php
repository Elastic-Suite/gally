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
use Elasticsuite\GraphQl\Type\Definition\FilterInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\GraphQl\Type\Definition\Filter\BoolFilterInputType;
use Elasticsuite\Search\GraphQl\Type\Definition\Filter\EqualTypeFilterInputType;
use Elasticsuite\Search\GraphQl\Type\Definition\Filter\MatchFilterInputType;
use Elasticsuite\Search\GraphQl\Type\Definition\Filter\RangeFilterInputType;
use GraphQL\Type\Definition\InputObjectType;

class FieldFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    public const NAME = 'FieldFilterInput';

    public function __construct(
        private BoolFilterInputType $boolFilterInputType,
        private EqualTypeFilterInputType $equalTypeFilterInputType,
        private MatchFilterInputType $matchFilterInputType,
        private RangeFilterInputType $rangeFilterInputType,
        private FilterQueryBuilder $filterQueryBuilder,
    ) {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'boolFilter' => ['type' => $this->boolFilterInputType],
                'equalFilter' => ['type' => $this->equalTypeFilterInputType],
                'matchFilter' => ['type' => $this->matchFilterInputType],
                'rangeFilter' => ['type' => $this->rangeFilterInputType],
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
        foreach ($inputData as $filterInputData) {
            if (isset($filterInputData['boolFilter'])) {
                $errors = array_merge($errors, $this->boolFilterInputType->validate('boolFilter', $filterInputData['boolFilter']));
            }

            if (isset($filterInputData['equalFilter'])) {
                $errors = array_merge($errors, $this->equalTypeFilterInputType->validate('equalFilter', $filterInputData['equalFilter']));
            }

            if (isset($filterInputData['rangeFilter'])) {
                $errors = array_merge($errors, $this->rangeFilterInputType->validate('rangeFilter', $filterInputData['rangeFilter']));
            }

            if (isset($filterInputData['matchFilter'])) {
                $errors = array_merge($errors, $this->matchFilterInputType->validate('matchFilter', $filterInputData['matchFilter']));
            }
        }

        return $errors;
    }

    public function transformToElasticsuiteFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig): QueryInterface
    {
        $filters = [];

        if (isset($inputFilter['boolFilter'])) {
            $filters[] = $this->boolFilterInputType->transformToElasticsuiteFilter($inputFilter['boolFilter'], $containerConfig);
        }

        if (isset($inputFilter['equalFilter'])) {
            $filters[] = $this->equalTypeFilterInputType->transformToElasticsuiteFilter($inputFilter['equalFilter'], $containerConfig);
        }

        if (isset($inputFilter['rangeFilter'])) {
            $filters[] = $this->rangeFilterInputType->transformToElasticsuiteFilter($inputFilter['rangeFilter'], $containerConfig);
        }

        if (isset($inputFilter['matchFilter'])) {
            $filters[] = $this->matchFilterInputType->transformToElasticsuiteFilter($inputFilter['matchFilter'], $containerConfig);
        }

        return $this->filterQueryBuilder->create($containerConfig, $filters);
    }
}
