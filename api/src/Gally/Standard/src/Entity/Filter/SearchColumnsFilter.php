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

namespace Gally\Entity\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;

/**
 * Filters the collection on several columns.
 * The columns must be defined in filter's properties.
 */
class SearchColumnsFilter extends SearchFilter
{
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        if (
            !$this->isPropertyEnabled($property, $resourceClass) ||
            !$this->isPropertyMapped($property, $resourceClass)
        ) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];

        /**
         * We get the properties from the filter declaration (see entities) to define the columns where we want to search.
         * For example if properties = ['defaultLabel' => ['code'],  $propertiesToFilter = ['code', 'defaultLabel'].
         */
        $propertiesToFilter = $this->properties[$property] ?? [];
        $propertiesToFilter = array_map('trim', $propertiesToFilter);
        $propertiesToFilter[] = $property;
        $propertiesToFilter = array_unique($propertiesToFilter);

        $wrapCase = $this->createWrapCase(false);
        $where = [];
        foreach ($propertiesToFilter as $propertyToFilter) {
            if ($this->isPropertyNested($propertyToFilter, $resourceClass)) {
                [$associationAlias, $field] = $this->addJoinsForNestedProperty(
                    $propertyToFilter,
                    $alias,
                    $queryBuilder,
                    $queryNameGenerator,
                    $resourceClass,
                    Join::LEFT_JOIN
                );
                $parameterName = $queryNameGenerator->generateParameterName($propertyToFilter);
                $aliasedField = sprintf('%s.%s', $associationAlias, $field);
            } else {
                $parameterName = $queryNameGenerator->generateParameterName($propertyToFilter);
                $aliasedField = sprintf('%s.%s', $alias, $propertyToFilter);
            }

            $where[] = $queryBuilder->expr()->like(
                $wrapCase($aliasedField),
                $wrapCase((string) $queryBuilder->expr()->concat("'%'", ':' . $parameterName, "'%'"))
            );
            $queryBuilder->setParameter($parameterName, $value);
        }

        $queryBuilder
            ->andWhere($queryBuilder->expr()->orX(...$where));
    }
}
