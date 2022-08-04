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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Builder\Query;

use Elasticsuite\DependencyInjection\GenericFactory;
use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Index\Model\Index\Mapping\Field;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use LogicException;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Filter query builder test case.
 */
class FilterQueryBuilderTest extends KernelTestCase
{
    private array $mockedQueryTypes = [
        QueryInterface::TYPE_TERMS,
        QueryInterface::TYPE_RANGE,
        QueryInterface::TYPE_MATCH,
        QueryInterface::TYPE_BOOL,
        QueryInterface::TYPE_NESTED,
        QueryInterface::TYPE_NOT,
    ];

    private array $fields;

    /**
     * Constructor.
     *
     * @param string $name     test case name
     * @param array  $data     test case data
     * @param string $dataName test case data name
     */
    public function __construct($name = null, array $data = [], string $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $this->fields = [
            new Field('id', 'integer'),
            new Field('simpleTextField', FieldInterface::FIELD_TYPE_KEYWORD),
            new Field('analyzedField', FieldInterface::FIELD_TYPE_TEXT, null, ['is_searchable' => true, 'is_filterable' => false]),
            new Field('nested.child', FieldInterface::FIELD_TYPE_KEYWORD, 'nested'),
        ];
    }

    /**
     * Test simple eq filter on the id field.
     */
    public function testSingleQueryFilter(): void
    {
        $query = $this->buildQuery(['simpleTextField' => 'filterValue']);
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_TERMS, $query->getType());

        $query = $this->buildQuery(['simpleTextField' => ['filterValue1', 'filterValue2']]);
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_TERMS, $query->getType());
    }

    /**
     * Test negative filter condition.
     */
    public function testNegativeFilterCondition(): void
    {
        $query = $this->buildQuery(['simpleTextField' => ['neq' => 'filterValue']]);
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_NOT, $query->getType());
    }

    /**
     * Test multiple fields query filter.
     */
    public function testMultipleQueryFilter(): void
    {
        $query = $this->buildQuery(['simpleTextField' => 'filterValue', 'id' => 1]);

        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_BOOL, $query->getType());
    }

    /**
     * Test range query conditions.
     */
    public function testRangeQueryFilters(): void
    {
        $rangeConditions = ['from', 'to', 'lteq', 'lte', 'lt', 'gteq', 'gte', 'moreq', 'gt'];
        foreach ($rangeConditions as $condition) {
            $query = $this->buildQuery(['id' => [$condition => 1]]);
            $this->assertInstanceOf(QueryInterface::class, $query);
            $this->assertEquals(QueryInterface::TYPE_RANGE, $query->getType());
        }
    }

    /**
     * Test fulltext query conditions.
     */
    public function testFulltextQueryFilter(): void
    {
        $query = $this->buildQuery(['simpleTextField' => ['like' => 'fulltext']]);
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_TERMS, $query->getType());

        $query = $this->buildQuery(['analyzedField' => ['like' => 'fulltext']]);
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MATCH, $query->getType());
    }

    /**
     * Test using a raw query as condition.
     */
    public function testRawQueryFilter(): void
    {
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $queryFilter = $this->buildQuery(['simpleTextField' => $query]);

        $this->assertInstanceOf(QueryInterface::class, $queryFilter);
    }

    /**
     * Test conditions on nested fields.
     */
    public function testNestedFieldFilter(): void
    {
        $query = $this->buildQuery(['nested.child' => 'filterValue']);

        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_NESTED, $query->getType());
    }

    /**
     * Test conditions on nested fields.
     */
    public function testNestedErrorFieldFilter(): void
    {
        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Can not filter nested field nested.child with nested path invalidCustomPath');
        $this->buildQuery(['nested.child' => 'filterValue'], 'invalidCustomPath');
    }

    /**
     * Test conditions on nested fields.
     */
    public function testNestedError2FieldFilter(): void
    {
        $this->expectException(LogicException::class);
        $this->expectExceptionMessage('Can not filter non nested field simpleTextField in nested context (nested)');
        $this->buildQuery(['simpleTextField' => 'filterValue'], 'nested');
    }

    /**
     * Test using a not supported exception throws an exception.
     */
    public function testUnsupportedCondition(): void
    {
        $this->expectExceptionMessage('Condition regexp is not supported.');
        $this->expectException(LogicException::class);
        $this->buildQuery(['simpleTextField' => ['regexp' => 'filterValue']]);
    }

    /**
     * Generate a query from conditions using mocked objects.
     */
    private function buildQuery(array $conditions, ?string $currentPath = null): QueryInterface
    {
        $builder = new FilterQueryBuilder($this->getQueryFactory($this->mockedQueryTypes));
        $config = $this->getContainerConfigMock($this->fields);

        return $builder->create($config, $conditions, $currentPath);
    }

    /**
     * Mock the query factory used by the builder.
     *
     * @param string[] $queryTypes mocked query types
     */
    private function getQueryFactory(array $queryTypes): QueryFactory
    {
        $factories = [];

        foreach ($queryTypes as $currentType) {
            $queryMock = $this->getMockBuilder(QueryInterface::class)->getMock();
            $queryMock->method('getType')->willReturn($currentType);

            $factory = $this->getMockBuilder(GenericFactory::class)->getMock();
            $factory->method('create')->willReturn($queryMock);

            $factories[$currentType] = $factory;
        }

        return new QueryFactory($factories);
    }

    /**
     * Mock the configuration used by the query builder.
     *
     * @param FieldInterface[] $fields mapping fields
     */
    private function getContainerConfigMock(array $fields): MockObject|ContainerConfigurationInterface
    {
        $config = $this->getMockBuilder(ContainerConfigurationInterface::class)
            ->disableOriginalConstructor()
            ->getMock();

        $mapping = new Mapping($fields);
        $config->method('getMapping')->willReturn($mapping);

        return $config;
    }
}
