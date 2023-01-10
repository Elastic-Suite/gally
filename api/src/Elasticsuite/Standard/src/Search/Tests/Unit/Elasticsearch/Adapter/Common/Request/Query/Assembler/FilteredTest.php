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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Filtered as FilteredQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Filtered as FilteredQuery;

/**
 * Filtered search request query test case.
 */
class FilteredTest extends AbstractComplexQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousFilteredQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $filteredQuery = new FilteredQuery($this->getSubQueryMock('baseQuery'), $this->getSubQueryMock('filterQuery'));
        $query = $assembler->assembleQuery($filteredQuery);

        $this->assertArrayHasKey('bool', $query);

        $this->assertArrayHasKey('must', $query['bool']);
        $this->assertEquals(['baseQuery'], $query['bool']['must']);

        $this->assertArrayHasKey('filter', $query['bool']);
        $this->assertEquals(['filterQuery'], $query['bool']['filter']);

        $this->assertEquals(FilteredQuery::DEFAULT_BOOST_VALUE, $query['bool']['boost']);

        $this->assertArrayNotHasKey('_name', $query['bool']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedFilteredQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $filteredQuery = new FilteredQuery($this->getSubQueryMock('baseQuery'), $this->getSubQueryMock('filterQuery'), 'queryName');
        $query = $assembler->assembleQuery($filteredQuery);

        $this->assertArrayHasKey('_name', $query['bool']);
        $this->assertEquals('queryName', $query['bool']['_name']);
    }

    public function testQueryLessFilteredQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $filteredQuery = new FilteredQuery(null, $this->getSubQueryMock('filterQuery'));
        $query = $assembler->assembleQuery($filteredQuery);

        $this->assertArrayHasKey('constant_score', $query);

        $this->assertArrayHasKey('filter', $query['constant_score']);
        $this->assertEquals(['filterQuery'], $query['constant_score']['filter']);
    }

    public function testEmptyFilteredQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $filteredQuery = new FilteredQuery();
        $query = $assembler->assembleQuery($filteredQuery);

        $this->assertArrayHasKey('constant_score', $query);

        $this->assertArrayHasKey('filter', $query['constant_score']);
        $this->assertEquals(['match_all' => new \stdClass()], $query['constant_score']['filter']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): FilteredQueryAssembler
    {
        return new FilteredQueryAssembler($this->getParentQueryAssembler());
    }
}
