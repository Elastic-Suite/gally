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

namespace Elasticsuite\Entity\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Common\Filter\BooleanFilterTrait;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter as BaseBooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

/**
 * Filters the collection by boolean values.
 * We add an option to treat null value as false.
 */
class BooleanFilter extends BaseBooleanFilter
{
    use BooleanFilterTrait;

    public function __construct(
        ManagerRegistry $managerRegistry,
        ?RequestStack $requestStack = null,
        LoggerInterface $logger = null,
        array $properties = null,
        NameConverterInterface $nameConverter = null,
        private bool $treatNullAsFalse = false
    ) {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);
    }

    /**
     * {@inheritdoc}
     */
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
            !$this->isPropertyMapped($property, $resourceClass) ||
            !$this->isBooleanField($property, $resourceClass)
        ) {
            return;
        }

        $value = $this->normalizeValue($value, $property);
        if (null === $value) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $field = $property;

        if ($this->isPropertyNested($property, $resourceClass)) {
            [$alias, $field] = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass);
        }

        $valueParameter = $queryNameGenerator->generateParameterName($field);

        if (!$value && $this->treatNullAsFalse) {
            $expr = sprintf('%s.%s = :%s or %s.%s is null', $alias, $field, $valueParameter, $alias, $field);
        } else {
            $expr = sprintf('%s.%s = :%s', $alias, $field, $valueParameter);
        }

        $queryBuilder->andWhere($expr)->setParameter($valueParameter, $value);
    }
}
