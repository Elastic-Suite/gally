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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\MultiMatch as MultiMatchQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfiguration\FuzzinessConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\Query\MultiMatch as MultiMatchQuery;

/**
 * MultiMatch search request query test case.
 */
class MultiMatchTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousMultiMatchQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchQuery = new MultiMatchQuery('search text', ['searchField' => 1]);
        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('multi_match', $query);
        $this->assertEquals('search text', $query['multi_match']['query']);
        $this->assertContains('searchField^1', $query['multi_match']['fields']);
        $this->assertCount(1, $query['multi_match']['fields']);
        $this->assertEquals(MultiMatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $query['multi_match']['minimum_should_match']);
        $this->assertEquals(MultiMatchQuery::DEFAULT_TIE_BREAKER, $query['multi_match']['tie_breaker']);
        $this->assertEquals(MultiMatchQuery::DEFAULT_MATCH_TYPE, $query['multi_match']['type']);
        $this->assertEquals(MultiMatchQuery::DEFAULT_BOOST_VALUE, $query['multi_match']['boost']);
        $this->assertArrayNotHasKey('_name', $query['multi_match']);
        $this->assertArrayNotHasKey('cutoff_frequency', $query['multi_match']);
        $this->assertArrayNotHasKey('fuzziness', $query['multi_match']);
        $this->assertArrayNotHasKey('prefix_length', $query['multi_match']);
        $this->assertArrayNotHasKey('max_expansions', $query['multi_match']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedMultiMatchQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchQuery = new MultiMatchQuery(
            'search text',
            ['searchField' => 1],
            MultiMatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH,
            MultiMatchQuery::DEFAULT_TIE_BREAKER,
            'queryName'
        );

        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('_name', $query['multi_match']);
        $this->assertEquals('queryName', $query['multi_match']['_name']);
    }

    /**
     * Test the assembler with mandatory + cutoff_frequency params.
     */
    public function testCutoffFrequencyMultiMatchQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $matchQuery = new MultiMatchQuery(
            'search text',
            ['searchField' => 1],
            MultiMatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH,
            MultiMatchQuery::DEFAULT_TIE_BREAKER,
            null,
            MultiMatchQuery::DEFAULT_BOOST_VALUE,
            null,
            0.1
        );

        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('cutoff_frequency', $query['multi_match']);
        $this->assertEquals(0.1, $query['multi_match']['cutoff_frequency']);
    }

    /**
     * Test the assembler with mandatory + fuzziness params.
     */
    public function testFuzzyMultiMatchQueryAssembler(): void
    {
        $fuzzyConfiguration = $this->getMockBuilder(FuzzinessConfigurationInterface::class)->getMock();
        $fuzzyConfiguration->method('getValue')->willReturn('AUTO');
        $fuzzyConfiguration->method('getPrefixLength')->willReturn(1);
        $fuzzyConfiguration->method('getMaxExpansion')->willReturn(10);

        $assembler = $this->getQueryAssembler();

        $matchQuery = new MultiMatchQuery(
            'search text',
            ['searchField' => 1],
            MultiMatchQuery::DEFAULT_MINIMUM_SHOULD_MATCH,
            MultiMatchQuery::DEFAULT_TIE_BREAKER,
            null,
            MultiMatchQuery::DEFAULT_BOOST_VALUE,
            $fuzzyConfiguration
        );

        $query = $assembler->assembleQuery($matchQuery);

        $this->assertArrayHasKey('fuzziness', $query['multi_match']);
        $this->assertEquals('AUTO', $query['multi_match']['fuzziness']);

        $this->assertArrayHasKey('prefix_length', $query['multi_match']);
        $this->assertEquals(1, $query['multi_match']['prefix_length']);

        $this->assertArrayHasKey('max_expansions', $query['multi_match']);
        $this->assertEquals(10, $query['multi_match']['max_expansions']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): MultiMatchQueryAssembler
    {
        return new MultiMatchQueryAssembler();
    }
}
