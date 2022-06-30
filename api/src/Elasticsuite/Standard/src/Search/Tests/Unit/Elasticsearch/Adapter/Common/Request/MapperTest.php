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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler as AggregationAssembler;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Mapper;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\SortOrder\Assembler as SortOrderAssembler;
use Elasticsuite\Search\Elasticsearch\Request;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter query mapper test case.
 */
class MapperTest extends KernelTestCase
{
    /**
     * Test mapping a base query.
     */
    public function testBaseQueryMapping(): void
    {
        $mapper = $this->getMapper();
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $searchRequest = new Request('requestName', 'indexName', $query, null, null, 0, 1);

        $mappedRequest = $mapper->assembleSearchRequest($searchRequest);

        $this->assertEquals(0, $mappedRequest['from']);
        $this->assertEquals(1, $mappedRequest['size']);
        $this->assertEquals([], $mappedRequest['sort']);
        $this->assertEquals(['mockQuery'], $mappedRequest['query']);
    }

    /**
     * Test mapping a query using a filter.
     */
    public function testFilteredQueryMapping(): void
    {
        $mapper = $this->getMapper();
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $filter = $this->getMockBuilder(QueryInterface::class)->getMock();
        $searchRequest = new Request('requestName', 'indexName', $query, $filter);

        $mappedRequest = $mapper->assembleSearchRequest($searchRequest);

        $this->assertEquals(['mockQuery'], $mappedRequest['post_filter']);
    }

    /**
     * Test aggregations mapping.
     */
    public function testAggregationsMapping(): void
    {
        $mapper = $this->getMapper();
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $aggs = $this->getMockBuilder(Request\AggregationInterface::class)->getMock();

        $searchRequest = new Request('requestName', 'indexName', $query, null, null, 0, 1, [$aggs]);

        $mappedRequest = $mapper->assembleSearchRequest($searchRequest);

        $this->assertEquals(['aggregations'], $mappedRequest['aggregations']);
    }

    /**
     * Test sort orders mapping.
     */
    /*
    public function testSortOrdersMapping(): void
    {
        $mapper  = $this->getMapper();
        $query   = $this->getMockBuilder(QueryInterface::class)->getMock();

        $searchRequest = new Request('requestName', 'indexName', $query, null, ['sort' => 'sort'], 0, 10);

        $mappedRequest = $mapper->assembleSearchRequest($searchRequest);

        $this->assertEquals('sortOrders', $mappedRequest['sort']);
    }
    */

    /**
     * Prepare the search request mapper used during tests.
     */
    private function getMapper(): Mapper
    {
        $queryAssemblerMock = $this->getMockBuilder(QueryAssembler::class)->disableOriginalConstructor()->getMock();
        $queryAssemblerMock->method('assembleQuery')->willReturn(['mockQuery']);

        $sortOrderAssemblerMock = $this->getMockBuilder(SortOrderAssembler::class)->disableOriginalConstructor()->getMock();
        $sortOrderAssemblerMock->method('assembleSortOrders')->willReturn([]);

        $aggregationAssemblerMock = $this->getMockBuilder(AggregationAssembler::class)->disableOriginalConstructor()->getMock();
        $aggregationAssemblerMock->method('assembleAggregations')->willReturn(['aggregations']);

        return new Mapper($queryAssemblerMock, $sortOrderAssemblerMock, $aggregationAssemblerMock);
    }
}
