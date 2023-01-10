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

namespace Gally\Search\GraphQl\Type\Definition\Filter;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use Gally\GraphQl\Type\Definition\FilterInterface;
use Gally\Search\Constant\FilterOperator;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Service\ReverseSourceFieldProvider;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class EqualTypeFilterInputType extends InputObjectType implements TypeInterface, FilterInterface
{
    use FilterableFieldTrait;

    public const NAME = 'EqualTypeFilterInput';

    public function __construct(
      private FilterQueryBuilder $filterQueryBuilder,
      private ReverseSourceFieldProvider $reverseSourceFieldProvider,
    ) {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'field' => Type::nonNull(Type::string()),
                FilterOperator::EQ => Type::string(),
                FilterOperator::IN => Type::listOf(Type::string()),
            ],
        ];
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function validate(string $argName, mixed $inputData, ContainerConfigurationInterface $containerConfig): array
    {
        $errors = [];

        $errors = array_merge($errors, $this->validateIsFilterable($inputData['field'], $containerConfig));
        if (!isset($inputData[FilterOperator::EQ]) && !isset($inputData[FilterOperator::IN])) {
            $errors[] = sprintf(
                "Filter argument %s: At least '%s' or '%s' should be filled.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::IN
            );
        }

        if (isset($inputData[FilterOperator::EQ]) && isset($inputData[FilterOperator::IN])) {
            $errors[] = sprintf(
                "Filter argument %s: Only '%s' or only '%s' should be filled, not both.",
                $argName,
                FilterOperator::EQ,
                FilterOperator::IN
            );
        }

        return $errors;
    }

    public function transformToGallyFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        $conditions = [];
        foreach ([FilterOperator::EQ, FilterOperator::IN] as $condition) {
            if (isset($inputFilter[$condition])) {
                $conditions = array_merge($conditions, [$condition => $inputFilter[$condition]]);
            }
        }
        $filterData = [$inputFilter['field'] => $conditions];

        return $this->filterQueryBuilder->create($containerConfig, $filterData);
    }
}
