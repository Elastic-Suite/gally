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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\MatchQuery as MatchQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\MatchQuery as MatchQuery;

/**
 * Match search request query test case.
 */
class MatchTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousMatchQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchQuery = new MatchQuery('search text', 'searchField');
        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('match', $query);
        $this->assertArrayHasKey('searchField', $query['match']);
        $this->assertEquals('search text', $query['match']['searchField']['query']);
        $this->assertEquals(MatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $query['match']['searchField']['minimum_should_match']);
        $this->assertEquals(MatchQuery::DEFAULT_BOOST_VALUE, $query['match']['searchField']['boost']);

        $this->assertArrayNotHasKey('_name', $query['match']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedMatchQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchQuery = new MatchQuery(
            'search text',
            'searchField',
            MatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH,
            'queryName',
            MatchQuery::DEFAULT_BOOST_VALUE
        );
        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('_name', $query['match']);
        $this->assertEquals('queryName', $query['match']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): MatchQueryAssembler
    {
        return new MatchQueryAssembler();
    }
}
