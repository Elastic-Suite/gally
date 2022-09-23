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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter;

use Elasticsuite\Exception\LogicException;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Prepare filter condition from an array as used into addFieldToFilter.
 */
class FilterQueryBuilder
{
    private array $mappedConditions = [
        'eq' => 'values',
        'neq' => 'values',
        'seq' => 'values',
        'sneq' => 'values',
        'in' => 'values',
        'nin' => 'values',
        'moreq' => 'gte',
        'gteq' => 'gte',
        'lteq' => 'lte',
        'like' => 'queryText',
        'fulltext' => 'queryText',
        'match' => 'queryText',
        'in_set' => 'values',
    ];

    private array $rangeConditions = ['gt', 'gte', 'lt', 'lte'];

    private array $negativeConditions = ['neq', 'sneq', 'nin'];

    /**
     * Constructor.
     *
     * @param QueryFactory $queryFactory Query factory (used to build sub-queries)
     */
    public function __construct(private QueryFactory $queryFactory)
    {
    }

    /**
     * Prepare filter condition from an array as used into addFieldToFilter.
     *
     * @param ContainerConfigurationInterface $containerConfig Search request container configuration
     * @param array                           $filters         Filters to be built
     * @param string|null                     $currentPath     Current nested path or null
     */
    public function create(ContainerConfigurationInterface $containerConfig, array $filters, string $currentPath = null): QueryInterface
    {
        $queries = [];

        $mapping = $containerConfig->getMapping();

        foreach ($filters as $fieldName => $condition) {
            if ($condition instanceof QueryInterface) {
                $queries[] = $condition;
            } else {
                $mappingField = $mapping->getField($fieldName);
                $queries[] = $this->prepareFieldCondition($mappingField, $condition, $currentPath);
            }
        }

        $filterQuery = current($queries);

        if (\count($queries) > 1) {
            $filterQuery = $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['must' => $queries]);
        }

        return $filterQuery;
    }

    /**
     * Transform the condition into a search request query object.
     *
     * @param FieldInterface   $field       Filter field
     * @param array|string|int $condition   Filter condition
     * @param string|null      $currentPath Current nested path or null
     */
    private function prepareFieldCondition(FieldInterface $field, mixed $condition, ?string $currentPath): QueryInterface
    {
        $queryType = QueryInterface::TYPE_TERMS;
        $condition = $this->prepareCondition($condition);

        if (\count(array_intersect($this->rangeConditions, array_keys($condition))) >= 1) {
            $queryType = QueryInterface::TYPE_RANGE;
            $condition = ['bounds' => $condition];
        }

        $condition['field'] = $field->getMappingProperty(FieldInterface::ANALYZER_UNTOUCHED);

        if (null === $condition['field'] || isset($condition['queryText'])) {
            $analyzer = $field->getDefaultSearchAnalyzer();
            $property = $field->getMappingProperty($analyzer);
            if (null !== $property) {
                $condition['field'] = $property;

                if (isset($condition['queryText'])) {
                    $queryType = QueryInterface::TYPE_MATCH;
                    $condition['minimumShouldMatch'] = '100%';
                }
            }
        }

        if (null === $condition['field']) {
            throw new LogicException(sprintf('Unable to identify the field property to use for filtering on "%s", possible invalid mapping', $field->getName()));
        }

        if ((QueryInterface::TYPE_TERMS === $queryType)
            && (FieldInterface::FILTER_LOGICAL_OPERATOR_AND === $field->getFilterLogicalOperator())
        ) {
            $query = $this->getCombinedTermsQuery($condition['field'], $condition['values']);
        } else {
            $query = $this->queryFactory->create($queryType, $condition);
        }

        if ($this->isNestedField($field, $currentPath)) {
            $queryParams = ['path' => $field->getNestedPath(), 'query' => $query];
            $query = $this->queryFactory->create(QueryInterface::TYPE_NESTED, $queryParams);
        }

        if (isset($condition['negative'])) {
            $query = $this->queryFactory->create(QueryInterface::TYPE_NOT, ['query' => $query]);
        }

        return $query;
    }

    /**
     * @param FieldInterface $field       Filter field
     * @param string|null    $currentPath Current nested path or null
     *
     * @throws \LogicException
     */
    private function isNestedField(FieldInterface $field, ?string $currentPath): bool
    {
        $isNested = $field->isNested();

        if (null !== $currentPath) {
            if ($field->isNested() && ($field->getNestedPath() !== $currentPath)) {
                throw new \LogicException("Can not filter nested field {$field->getName()} with nested path $currentPath");
            }
            if (!$field->isNested()) {
                throw new \LogicException("Can not filter non nested field {$field->getName()} in nested context ($currentPath)");
            }

            $isNested = false;
        }

        return $isNested;
    }

    /**
     * Ensure the condition is supported and try to transform it into a supported type.
     *
     * @param array|int|string $condition Parsed condition
     */
    private function prepareCondition(mixed $condition): array
    {
        if (!\is_array($condition)) {
            $condition = ['in' => [$condition]];
        }

        $conditionKeys = array_keys($condition);

        if (\is_int(current($conditionKeys))) {
            $condition = ['in' => $condition];
        }

        foreach ($condition as $key => $value) {
            if (!isset($this->mappedConditions[$key]) && !\in_array($key, $this->rangeConditions, true)) {
                throw new \LogicException("Condition {$key} is not supported.");
            }

            if (isset($this->mappedConditions[$key])) {
                $condition[$this->mappedConditions[$key]] = $value;
                unset($condition[$key]);
            }

            if (\in_array($key, $this->negativeConditions, true)) {
                $condition['negative'] = true;
            }
        }

        return $condition;
    }

    /**
     * Get a filter query corresponding to combining terms with a logical AND.
     *
     * @param string $field  Filter field
     * @param mixed  $values Filter values
     */
    private function getCombinedTermsQuery(string $field, mixed $values): QueryInterface
    {
        $query = null;

        if (\is_string($values)) {
            $values = explode(',', $values);
        } elseif (!\is_array($values)) {
            $values = [$values];
        }

        $filters = [];
        foreach ($values as $value) {
            $filters[] = $this->queryFactory->create(QueryInterface::TYPE_TERM, ['field' => $field, 'value' => $value]);
        }

        if (1 === \count($filters)) {
            // Avoids using a boolean clause for a single term.
            $query = current($filters);
        } elseif (\count($filters) > 0) {
            $query = $this->queryFactory->create(QueryInterface::TYPE_BOOL, ['must' => $filters]);
        }

        return $query;
    }
}
