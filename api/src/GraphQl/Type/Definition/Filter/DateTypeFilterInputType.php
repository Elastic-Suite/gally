<?php
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace App\GraphQl\Type\Definition\Filter;

use Gally\Metadata\GraphQl\Type\Definition\Filter\DateTypeFilterInputType as BaseDateTypeFilterInputType;
use Gally\Search\Constant\FilterOperator;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;

class DateTypeFilterInputType extends BaseDateTypeFilterInputType
{
    public const DATE_RANGE_SEPARATOR = '_';

    public function transformToGallyFilter(array $inputFilter, ContainerConfigurationInterface $containerConfig, array $filterContext = []): QueryInterface
    {
        if (isset($inputFilter[FilterOperator::IN])) {
            $queries = [];
            foreach ($inputFilter[FilterOperator::IN] as $value) {
                $values = $this->getBoundsFromValue($value);
                $queries[] = parent::transformToGallyFilter(
                    array_filter([
                        'field' => $inputFilter['field'],
                        FilterOperator::GTE => $values[0],
                        FilterOperator::LTE => $values[1],
                        'format' => ''
                    ]),
                    $containerConfig,
                    $filterContext
                );
            }

            return $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['should' => $queries]);
        }

        if (isset($inputFilter[FilterOperator::EQ])) {
            $values = $this->getBoundsFromValue($inputFilter[FilterOperator::EQ]);
            $inputFilter[FilterOperator::GTE] = $values[0];
            $inputFilter[FilterOperator::LTE] = $values[1];
            unset($inputFilter[FilterOperator::EQ]);
            $inputFilter = array_filter($inputFilter);
        }

        return parent::transformToGallyFilter($inputFilter, $containerConfig, $filterContext);
    }

    private function getBoundsFromValue(string $value): array
    {
        if (!str_contains($value, self::DATE_RANGE_SEPARATOR)) {
            return [$value, $value];
        }

        $values = explode(self::DATE_RANGE_SEPARATOR, $value);
        $values[0] = ($values[0] ?? '*') === '*' ? null : ($values[0] ?? null);
        $values[1] = ($values[1] ?? '*') === '*' ? null : ($values[1] ?? null);

        return $values;
    }
}
