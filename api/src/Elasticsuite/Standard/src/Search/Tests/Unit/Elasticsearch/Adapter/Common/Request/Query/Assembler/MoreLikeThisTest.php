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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\MoreLikeThis as MoreLikeThisQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\MoreLikeThis as MoreLikeThisQuery;

class MoreLikeThisTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousMoreLikeThisQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $moreLikeThisQuery = new MoreLikeThisQuery(['searchField'], 'search like text');
        $query = $assembler->assembleQuery($moreLikeThisQuery);

        $this->checkDefaultStructure($query);
        $this->assertArrayNotHasKey('_name', $query['more_like_this']);

        $this->assertEquals(['searchField'], $query['more_like_this']['fields']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $query['more_like_this']['minimum_should_match']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_BOOST_VALUE, $query['more_like_this']['boost']);
        $this->assertEquals('search like text', $query['more_like_this']['like']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_BOOST_TERMS, $query['more_like_this']['boost_terms']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_MIN_TERM_FREQ, $query['more_like_this']['min_term_freq']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_MIN_DOC_FREQ, $query['more_like_this']['min_doc_freq']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_MAX_DOC_FREQ, $query['more_like_this']['max_doc_freq']);
        $this->assertEquals(MoreLikeThisQuery::DEFAULT_MAX_QUERY_TERMS, $query['more_like_this']['max_query_terms']);
        $this->assertFalse($query['more_like_this']['include']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedMoreLikeThisQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $moreLikeThisQuery = new MoreLikeThisQuery(
            ['searchField1', 'searchField2'],
            [['_id' => 1], ['_id' => 2]],
            '3<75%',
            10,
            5,
            2,
            75,
            25,
            true,
            'queryName',
            15
        );
        $query = $assembler->assembleQuery($moreLikeThisQuery);

        $this->checkDefaultStructure($query);
        $this->assertArrayHasKey('_name', $query['more_like_this']);

        $this->assertEquals(['searchField1', 'searchField2'], $query['more_like_this']['fields']);
        $this->assertEquals('3<75%', $query['more_like_this']['minimum_should_match']);
        $this->assertEquals(15, $query['more_like_this']['boost']);
        $this->assertEquals([['_id' => 1], ['_id' => 2]], $query['more_like_this']['like']);
        $this->assertEquals(10, $query['more_like_this']['boost_terms']);
        $this->assertEquals(5, $query['more_like_this']['min_term_freq']);
        $this->assertEquals(2, $query['more_like_this']['min_doc_freq']);
        $this->assertEquals(75, $query['more_like_this']['max_doc_freq']);
        $this->assertEquals(25, $query['more_like_this']['max_query_terms']);
        $this->assertTrue($query['more_like_this']['include']);
    }

    /**
     * Check the minimum structure of the built query.
     *
     * @param array $query Built query
     */
    private function checkDefaultStructure(array $query): void
    {
        $this->assertArrayHasKey('more_like_this', $query);

        $this->assertArrayHasKey('fields', $query['more_like_this']);
        $this->assertArrayHasKey('minimum_should_match', $query['more_like_this']);
        $this->assertArrayHasKey('boost', $query['more_like_this']);
        $this->assertArrayHasKey('like', $query['more_like_this']);
        $this->assertArrayHasKey('boost_terms', $query['more_like_this']);
        $this->assertArrayHasKey('min_term_freq', $query['more_like_this']);
        $this->assertArrayHasKey('min_doc_freq', $query['more_like_this']);
        $this->assertArrayHasKey('max_doc_freq', $query['more_like_this']);
        $this->assertArrayHasKey('max_query_terms', $query['more_like_this']);
        $this->assertArrayHasKey('include', $query['more_like_this']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): MoreLikeThisQueryAssembler
    {
        return new MoreLikeThisQueryAssembler();
    }
}
