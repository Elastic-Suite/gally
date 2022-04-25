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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Boolean as BooleanQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Boolean as BooleanQuery;

/**
 * Boolean search request query test case.
 */
class BooleanTest extends AbstractComplexQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testDefaultBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery();
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertArrayHasKey('bool', $query);

        $this->assertEquals(BooleanQuery::DEFAULT_BOOST_VALUE, $query['bool']['boost']);
        $this->assertArrayNotHasKey('minimum_should_match', $query['bool']);

        $this->assertArrayHasKey('must', $query['bool']);
        $this->assertArrayHasKey('should', $query['bool']);
        $this->assertArrayHasKey('must_not', $query['bool']);

        $this->assertArrayNotHasKey('_name', $query['bool']);
        $this->assertArrayNotHasKey('_cache', $query['bool']);
    }

    /**
     * Pure must query assembler test.
     */
    public function testMustBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery([$this->getSubQueryMock('mustClause1'), $this->getSubQueryMock('mustClause2')]);
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertCount(2, $query['bool']['must']);
        $this->assertArrayNotHasKey('minimum_should_match', $query['bool']);
        $this->assertContains(['mustClause1'], $query['bool']['must']);
        $this->assertContains(['mustClause2'], $query['bool']['must']);
    }

    /**
     * Pure should query assembler test.
     */
    public function testShouldBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery([], [$this->getSubQueryMock('shouldClause1'), $this->getSubQueryMock('shouldClause2')]);
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertEquals(1, $query['bool']['minimum_should_match']);
        $this->assertCount(2, $query['bool']['should']);
        $this->assertContains(['shouldClause1'], $query['bool']['should']);
        $this->assertContains(['shouldClause2'], $query['bool']['should']);
    }

    /**
     * Pure must not query assembler test.
     */
    public function testMustNotBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery([], [], [$this->getSubQueryMock('mustNotClause1'), $this->getSubQueryMock('mustNotClause2')]);
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertArrayNotHasKey('minimum_should_match', $query['bool']);
        $this->assertCount(2, $query['bool']['must_not']);
        $this->assertContains(['mustNotClause1'], $query['bool']['must_not']);
        $this->assertContains(['mustNotClause2'], $query['bool']['must_not']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery([], [], [], 1, 'queryName');
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertArrayHasKey('_name', $query['bool']);
        $this->assertEquals('queryName', $query['bool']['_name']);
    }

    /**
     * Test the assembler with mandatory + cache params.
     */
    public function testCachedBooleanQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $boolQuery = new BooleanQuery([], [], [], 1, null, BooleanQuery::DEFAULT_BOOST_VALUE, true);
        $query = $assembler->assembleQuery($boolQuery);

        $this->assertArrayHasKey('_cache', $query['bool']);
        $this->assertTrue($query['bool']['_cache']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): BooleanQueryAssembler
    {
        return new BooleanQueryAssembler($this->getParentQueryAssembler());
    }
}
