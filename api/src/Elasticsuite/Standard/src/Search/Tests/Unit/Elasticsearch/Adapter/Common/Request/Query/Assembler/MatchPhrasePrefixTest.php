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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\MatchPhrasePrefix as MatchPhrasePrefixQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\MatchPhrasePrefix as MatchPhrasePrefixQuery;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

class MatchPhrasePrefixTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousMatchPhrasePrefixQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchPhrasePrefixQuery = new MatchPhrasePrefixQuery('search text', 'searchField');
        $query = $assembler->assembleQuery($matchPhrasePrefixQuery);

        $this->checkDefaultStructure($query);

        $this->assertEquals('search text', $query['match_phrase_prefix']['searchField']['query']);
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query['match_phrase_prefix']['searchField']['boost']);
        $this->assertEquals(10, $query['match_phrase_prefix']['searchField']['max_expansions']);

        $this->assertArrayNotHasKey('_name', $query['match_phrase_prefix']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedMatchPhrasePrefixQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchPhrasePrefixQuery = new MatchPhrasePrefixQuery(
            'search text',
            'searchField',
            10,
            'queryName',
            QueryInterface::DEFAULT_BOOST_VALUE
        );
        $query = $assembler->assembleQuery($matchPhrasePrefixQuery);

        $this->checkDefaultStructure($query);
        $this->assertArrayHasKey('_name', $query['match_phrase_prefix']);

        $this->assertEquals('search text', $query['match_phrase_prefix']['searchField']['query']);
        $this->assertEquals(MatchPhrasePrefixQuery::DEFAULT_BOOST_VALUE, $query['match_phrase_prefix']['searchField']['boost']);
        $this->assertEquals(10, $query['match_phrase_prefix']['searchField']['max_expansions']);
        $this->assertEquals('queryName', $query['match_phrase_prefix']['_name']);
    }

    /**
     * Check the minimum structure of the built query.
     *
     * @param array $query Built query
     */
    private function checkDefaultStructure(array $query): void
    {
        $this->assertArrayHasKey('match_phrase_prefix', $query);
        $this->assertArrayHasKey('searchField', $query['match_phrase_prefix']);
        $this->assertArrayHasKey('query', $query['match_phrase_prefix']['searchField']);
        $this->assertArrayHasKey('boost', $query['match_phrase_prefix']['searchField']);
        $this->assertArrayHasKey('max_expansions', $query['match_phrase_prefix']['searchField']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): MatchPhrasePrefixQueryAssembler
    {
        return new MatchPhrasePrefixQueryAssembler();
    }
}
