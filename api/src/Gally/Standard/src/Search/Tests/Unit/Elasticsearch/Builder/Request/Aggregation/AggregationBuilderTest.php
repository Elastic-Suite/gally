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

namespace Gally\Search\Tests\Unit\Elasticsearch\Builder\Request\Aggregation;

use Gally\Index\Model\Index\Mapping;
use Gally\Index\Model\Index\MappingInterface;
use Gally\Search\Elasticsearch\Builder\Request\Aggregation\AggregationBuilder;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Request\Aggregation\Bucket\Terms;
use Gally\Search\Elasticsearch\Request\AggregationFactory;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search request aggregation builder test case.
 */
class AggregationBuilderTest extends KernelTestCase
{
    /**
     * Test building aggregations for simple fields.
     */
    public function testSimpleAggBuilder(): void
    {
        $builder = new AggregationBuilder($this->getAggregationFactory(), $this->getFilterQueryBuilder());
        $containerConfig = $this->getContainerConfiguration();
        $aggregationsData = [
            ['name' => 'simpleField', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
            ['name' => 'searchableField', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
            ['name' => 'fieldNotInMapping', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
        ];

        /** @var BucketInterface[] $aggregations */
        $aggregations = $builder->buildAggregations($containerConfig, $aggregationsData, []);

        $this->assertCount(3, $aggregations);

        $this->assertInstanceOf(Terms::class, $aggregations[0]);
        $this->assertEquals('simpleField', $aggregations[0]->getField());
        $this->assertEquals('simpleField', $aggregations[0]->getName());

        $this->assertEquals('searchableField.untouched', $aggregations[1]->getField());
        $this->assertEquals('searchableField', $aggregations[1]->getName());

        $this->assertInstanceOf(Terms::class, $aggregations[2]);
        $this->assertEquals('fieldNotInMapping', $aggregations[2]->getField());
        $this->assertEquals('fieldNotInMapping', $aggregations[2]->getName());
    }

    /**
     * Test building filtered aggregations for simple fields.
     */
    public function testFilteredAggBuilder(): void
    {
        $builder = new AggregationBuilder($this->getAggregationFactory(), $this->getFilterQueryBuilder());
        $containerConfig = $this->getContainerConfiguration();
        $aggregationsData = [
            ['name' => 'simpleField', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
            ['name' => 'searchableField', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
        ];

        $filters = [
            'simpleField' => 'simpleFieldFilter',
            'searchableField' => 'searchableFieldFilter',
        ];

        /** @var BucketInterface[] $aggregations */
        $aggregations = $builder->buildAggregations($containerConfig, $aggregationsData, $filters);

        $this->assertCount(2, $aggregations);

        $this->assertInstanceOf(Terms::class, $aggregations[0]);
        $this->assertEquals('simpleField', $aggregations[0]->getField());
        $this->assertEquals('simpleField', $aggregations[0]->getName());
        $this->assertEquals('', $aggregations[0]->getNestedPath());
        $this->assertInstanceOf(QueryInterface::class, $aggregations[0]->getFilter());

        $this->assertInstanceOf(Terms::class, $aggregations[1]);
        $this->assertEquals('searchableField.untouched', $aggregations[1]->getField());
        $this->assertEquals('searchableField', $aggregations[1]->getName());
        $this->assertInstanceOf(QueryInterface::class, $aggregations[1]->getFilter());
    }

    /**
     * Test building aggregations for nested fields.
     *
     * @return void
     */
    public function testNestedAggBuilder()
    {
        $builder = new AggregationBuilder($this->getAggregationFactory(), $this->getFilterQueryBuilder());
        $containerConfig = $this->getContainerConfiguration();
        $aggregationsData = [
            ['name' => 'nested.simpleField', 'type' => BucketInterface::TYPE_TERMS, 'foo' => 'bar'],
        ];

        /** @var BucketInterface[] $aggregations */
        $aggregations = $builder->buildAggregations($containerConfig, $aggregationsData, []);

        $this->assertCount(1, $aggregations);

        $this->assertInstanceOf(Terms::class, $aggregations[0]);
        $this->assertEquals('nested.simpleField', $aggregations[0]->getField());
        $this->assertEquals('nested.simpleField', $aggregations[0]->getName());
        $this->assertEquals('nested', $aggregations[0]->getNestedPath());
    }

    /**
     * Test building aggregations for nested fields.
     *
     * @return void
     */
    public function testSubAggBuilder()
    {
        $builder = new AggregationBuilder($this->getAggregationFactory(), $this->getFilterQueryBuilder());
        $containerConfig = $this->getContainerConfiguration();
        $aggregationsData = [
            [
                'name' => 'nested.simpleField',
                'type' => BucketInterface::TYPE_TERMS,
                'foo' => 'bar',
                'childAggregations' => [
                    ['name' => 'simpleField', 'type' => BucketInterface::TYPE_TERMS],
                ],
            ],
        ];

        /** @var BucketInterface[] $aggregations */
        $aggregations = $builder->buildAggregations($containerConfig, $aggregationsData, []);

        $this->assertCount(1, $aggregations);

        $this->assertInstanceOf(Terms::class, $aggregations[0]);
        $this->assertEquals('nested.simpleField', $aggregations[0]->getField());
        $this->assertEquals('nested.simpleField', $aggregations[0]->getName());
        $this->assertInstanceOf(Terms::class, $aggregations[0]->getChildAggregations()[0]);
        $this->assertEquals('simpleField', $aggregations[0]->getChildAggregations()[0]->getField());
        $this->assertEquals('simpleField', $aggregations[0]->getChildAggregations()[0]->getName());
        $this->assertEquals('nested', $aggregations[0]->getNestedPath());
    }

    /**
     * Test building aggregations for nested fields when using filters.
     *
     * @return void
     */
    public function testNestedFilteredAggBuilder()
    {
        $builder = new AggregationBuilder($this->getAggregationFactory(), $this->getFilterQueryBuilder());
        $containerConfig = $this->getContainerConfiguration();
        $filters = ['simpleField' => 'simpleFieldFilter'];
        $nestedFilter = $this->getMockBuilder(QueryInterface::class)->getMock();
        $nestedFilter->method('getName')->willReturn('simpleNestedFieldFilter');
        $aggregationsData = [
            [
                'name' => 'nested.simpleField',
                'type' => BucketInterface::TYPE_TERMS,
                'nestedFilter' => ['nested.searchableField' => 'simpleNestedFieldFilter'],
            ],
        ];

        /** @var BucketInterface[] $aggregations */
        $aggregations = $builder->buildAggregations($containerConfig, $aggregationsData, $filters);

        $this->assertCount(1, $aggregations);
        $this->assertInstanceOf(Terms::class, $aggregations[0]);
        $this->assertEquals('nested.simpleField', $aggregations[0]->getField());
        $this->assertEquals('nested.simpleField', $aggregations[0]->getName());
        $this->assertEquals('nested', $aggregations[0]->getNestedPath());
        $this->assertInstanceOf(QueryInterface::class, $aggregations[0]->getFilter());
        $this->assertInstanceOf(QueryInterface::class, $aggregations[0]->getNestedFilter());
    }

    /**
     * Search request filter query builder used during test.
     */
    private function getFilterQueryBuilder(): FilterQueryBuilder
    {
        $queryMock = $this->getMockBuilder(QueryInterface::class)
            ->setMethods(['getQuery', 'getName', 'getType', 'getBoost'])
            ->getMock();

        $queryFactory = $this->getMockBuilder(QueryFactory::class)->disableOriginalConstructor()->getMock();
        $queryFactory->method('create')->willReturn($queryMock);

        return new FilterQueryBuilder($queryFactory);
    }

    /**
     * Aggregation factory used during tests.
     */
    private function getAggregationFactory(): AggregationFactory
    {
        return static::getContainer()->get(AggregationFactory::class);
    }

    /**
     * Container configuration used during tests.
     */
    private function getContainerConfiguration(): MockObject|ContainerConfigurationInterface
    {
        $containerConfig = $this->getMockBuilder(ContainerConfigurationInterface::class)->getMock();

        $mapping = $this->getMapping();
        $containerConfig->method('getMapping')
            ->willReturn($mapping);

        return $containerConfig;
    }

    /**
     * Mapping used during tests.
     */
    private function getMapping(): MappingInterface
    {
        $fields = [
            new Mapping\Field('id', Mapping\FieldInterface::FIELD_TYPE_INTEGER),
            new Mapping\Field('simpleField', Mapping\FieldInterface::FIELD_TYPE_KEYWORD),
            new Mapping\Field('searchableField', Mapping\FieldInterface::FIELD_TYPE_TEXT, null, ['is_searchable' => true]),
            new Mapping\Field('nested.simpleField', Mapping\FieldInterface::FIELD_TYPE_KEYWORD, 'nested'),
            new Mapping\Field('nested.searchableField', Mapping\FieldInterface::FIELD_TYPE_TEXT, 'nested', ['is_searchable' => true]),
            new Mapping\Field('notFilterableField', Mapping\FieldInterface::FIELD_TYPE_TEXT, null, ['is_filterable' => false, 'is_searchable' => true]),
        ];

        return new Mapping($fields);
    }
}
