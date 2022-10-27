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

namespace Elasticsuite\Entity\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Common\Filter\RangeFilterTrait;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter as BaseRangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

class RangeFilterWithDefault extends BaseRangeFilter
{
    use RangeFilterTrait;

    public function __construct(
        ManagerRegistry $managerRegistry,
        ?RequestStack $requestStack = null,
        LoggerInterface $logger = null,
        array $properties = null,
        NameConverterInterface $nameConverter = null,
        private string $defaultAlias = 'default',
        private array $defaultValues = []
    ) {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);
    }

    /**
     * {@inheritDoc}
     */
    protected function addWhere(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, $alias, $field, $operator, $value)
    {
        $valueParameter = $queryNameGenerator->generateParameterName($field);

        $defaultValue = $this->defaultValues[$field];
        $fieldWithDefault = "(CASE WHEN $alias.$field IS NULL THEN " .
            "(CASE WHEN $this->defaultAlias.$field IS NOT NULL THEN $this->defaultAlias.$field ELSE '$defaultValue' END) " .
            "ELSE $alias.$field END)";

        switch ($operator) {
            case self::PARAMETER_BETWEEN:
                $rangeValue = explode('..', $value);

                $rangeValue = $this->normalizeBetweenValues($rangeValue);
                if (null === $rangeValue) {
                    return;
                }

                if ($rangeValue[0] === $rangeValue[1]) {
                    $queryBuilder
                        ->andWhere(sprintf('%s = :%s', $fieldWithDefault, $valueParameter))
                        ->setParameter($valueParameter, $rangeValue[0]);

                    return;
                }

                $queryBuilder
                    ->andWhere(sprintf('%1$s >= :%2$s_1 AND %1$s <= :%2$s_2', $fieldWithDefault, $valueParameter))
                    ->setParameter(sprintf('%s_1', $valueParameter), $rangeValue[0])
                    ->setParameter(sprintf('%s_2', $valueParameter), $rangeValue[1]);

                break;
            case self::PARAMETER_GREATER_THAN:
                $value = $this->normalizeValue($value, $operator);
                if (null === $value) {
                    return;
                }

                $queryBuilder
                    ->andWhere(sprintf('%s > :%s', $fieldWithDefault, $valueParameter))
                    ->setParameter($valueParameter, $value);

                break;
            case self::PARAMETER_GREATER_THAN_OR_EQUAL:
                $value = $this->normalizeValue($value, $operator);
                if (null === $value) {
                    return;
                }

                $queryBuilder
                    ->andWhere(sprintf('%s >= :%s', $fieldWithDefault, $valueParameter))
                    ->setParameter($valueParameter, $value);

                break;
            case self::PARAMETER_LESS_THAN:
                $value = $this->normalizeValue($value, $operator);
                if (null === $value) {
                    return;
                }

                $queryBuilder
                    ->andWhere(sprintf('%s < :%s', $fieldWithDefault, $valueParameter))
                    ->setParameter($valueParameter, $value);

                break;
            case self::PARAMETER_LESS_THAN_OR_EQUAL:
                $value = $this->normalizeValue($value, $operator);
                if (null === $value) {
                    return;
                }

                $queryBuilder
                    ->andWhere(sprintf('%s <= :%s', $fieldWithDefault, $valueParameter))
                    ->setParameter($valueParameter, $value);

                break;
        }
    }
}
