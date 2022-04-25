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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\FunctionScore as FunctionScoreQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\FunctionScore as FunctionScoreQuery;

/**
 * FunctionScore search request query test case.
 */
class FunctionScoreTest extends AbstractComplexQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     *
     * @return void
     */
    public function testAnonymousFunctionScoreQueryAssembler()
    {
        $assembler = $this->getQueryAssembler();

        $baseQuery = $this->getSubQueryMock('baseQuery');
        $functions = [
            'filterFunction' => [
                'filter' => $this->getSubQueryMock('filterFunctionQuery'),
                'functionName' => 'filteredFunction',
            ],
            'unfilteredFunction' => [
                'functionName' => 'unfilteredFunction',
            ],
        ];

        $functionScoreQuery = new FunctionScoreQuery($baseQuery, $functions);
        $query = $assembler->assembleQuery($functionScoreQuery);

        $this->assertArrayHasKey('function_score', $query);

        $this->assertArrayHasKey('query', $query['function_score']);
        $this->assertEquals(['baseQuery'], $query['function_score']['query']);

        $this->assertArrayHasKey('functions', $query['function_score']);
        $this->assertCount(2, $query['function_score']['functions']);

        $this->assertEquals(['filterFunctionQuery'], $query['function_score']['functions'][0]['filter']);
        $this->assertEquals('filteredFunction', $query['function_score']['functions'][0]['functionName']);
        $this->assertEquals('unfilteredFunction', $query['function_score']['functions'][1]['functionName']);

        $this->assertEquals(FunctionScoreQuery::SCORE_MODE_SUM, $query['function_score']['score_mode']);
        $this->assertEquals(FunctionScoreQuery::BOOST_MODE_SUM, $query['function_score']['boost_mode']);

        $this->assertArrayNotHasKey('_name', $query['function_score']);
    }

    /**
     * Test the assembler with mandatory + name params.
     *
     * @return void
     */
    public function testNamedFunctionScoreQueryAssembler()
    {
        $assembler = $this->getQueryAssembler();

        $functionScoreQuery = new FunctionScoreQuery($this->getSubQueryMock('baseQuery'), [], 'queryName');
        $query = $assembler->assembleQuery($functionScoreQuery);

        $this->assertArrayHasKey('_name', $query['function_score']);
        $this->assertEquals('queryName', $query['function_score']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): FunctionScoreQueryAssembler
    {
        return new FunctionScoreQueryAssembler($this->getParentQueryAssembler());
    }
}
