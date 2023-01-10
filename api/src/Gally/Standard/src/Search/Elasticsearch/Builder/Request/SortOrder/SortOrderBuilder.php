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

namespace Gally\Search\Elasticsearch\Builder\Request\SortOrder;

use Gally\Index\Model\Index\Mapping\FieldInterface;
use Gally\Index\Model\Index\MappingInterface;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;

/**
 * Allow to build a sort order from arrays.
 */
class SortOrderBuilder
{
    /**
     * Constructor.
     *
     * @param FilterQueryBuilder $queryBuilder Query builder used to build queries inside nested sort order
     */
    public function __construct(private FilterQueryBuilder $queryBuilder)
    {
    }

    /**
     * Build sort orders from array of sort orders definition.
     *
     * @param ContainerConfigurationInterface $containerConfig Request configuration
     * @param array                           $orders          Sort orders definitions
     *
     * @return SortOrderInterface[]
     */
    public function buildSortOrders(ContainerConfigurationInterface $containerConfig, array $orders): array
    {
        $sortOrders = [];
        $mapping = $containerConfig->getMapping();

        $orders = $this->addDefaultSortOrders($orders, $mapping);

        foreach ($orders as $fieldName => $sortOrderParams) {
            $type = Standard::class;

            if (Script::SCRIPT_FIELD === $fieldName) {
                $type = Script::class;
                if ($sortOrderParams['direction'] && \is_array($sortOrderParams['direction'])) {
                    $sortOrderParams = $sortOrderParams['direction'];
                }
            }

            try {
                $sortField = $mapping->getField($fieldName);
                $sortOrderParams = $this->getSortOrderParams($sortField, $sortOrderParams);

                if (isset($sortOrderParams['nestedPath'])) {
                    $type = Nested::class;
                }

                if (isset($sortOrderParams['nestedFilter'])) {
                    $nestedFilter = $this->queryBuilder->create(
                        $containerConfig,
                        $sortOrderParams['nestedFilter'],
                        $sortOrderParams['nestedPath']
                    );
                    $sortOrderParams['nestedFilter'] = $nestedFilter;
                }
            } catch (\LogicException $exception) {
                $sortOrderParams['field'] = $fieldName;
            }

            if (Script::class == $type) {
                unset($sortOrderParams['field']);
            }

            $sortOrders[] = new $type(...$sortOrderParams);
        }

        return $sortOrders;
    }

    /**
     * Append default sort to all queries to get fully predictable search results.
     *
     * Order by _score first and then by the id field.
     *
     * @param array            $orders  Original orders
     * @param MappingInterface $mapping Mapping
     */
    private function addDefaultSortOrders(array $orders, MappingInterface $mapping): array
    {
        $defaultOrders = [
            SortOrderInterface::DEFAULT_SORT_FIELD => SortOrderInterface::SORT_DESC,
            $mapping->getIdField()->getName() => SortOrderInterface::SORT_DESC,
        ];

        if (\count($orders) > 0) {
            $firstOrder = array_key_first($orders);
            if (SortOrderInterface::DEFAULT_SORT_FIELD !== $firstOrder && SortOrderInterface::SORT_DESC === $orders[$firstOrder]['direction']) {
                $defaultOrders[SortOrderInterface::DEFAULT_SORT_FIELD] = SortOrderInterface::SORT_ASC;
                $defaultOrders[$mapping->getIdField()->getName()] = SortOrderInterface::SORT_ASC;
            }
        }

        foreach ($defaultOrders as $currentOrder => $direction) {
            if (!\in_array($currentOrder, array_keys($orders), true)) {
                $orders[$currentOrder] = ['direction' => $direction];
            }
        }

        return $orders;
    }

    /**
     * Retrieve base params for a sort order field.
     *
     * @param FieldInterface $field           Sort order field
     * @param array          $sortOrderParams Sort order params
     */
    private function getSortOrderParams(FieldInterface $field, array $sortOrderParams): array
    {
        $sortOrderParams['field'] = $field->getMappingProperty(FieldInterface::ANALYZER_SORTABLE);
        $sortOrderParams['missing'] = $field->getSortMissing($sortOrderParams['direction']);

        if ($field->isNested() && !isset($sortOrderParams['nestedPath'])) {
            $sortOrderParams['nestedPath'] = $field->getNestedPath();
        }

        return $sortOrderParams;
    }
}
