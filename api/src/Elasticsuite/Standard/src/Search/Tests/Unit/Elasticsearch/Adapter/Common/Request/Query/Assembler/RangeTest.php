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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Range as RangeQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Range as RangeQuery;

/**
 * Range search request query test case.
 */
class RangeTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousRangeQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $rangeQuery = new RangeQuery('field', ['bounds']);
        $query = $assembler->assembleQuery($rangeQuery);

        $this->assertArrayHasKey('range', $query);
        $this->assertArrayHasKey('field', $query['range']);
        $this->assertEquals(['bounds'] + ['boost' => RangeQuery::DEFAULT_BOOST_VALUE], $query['range']['field']);
        $this->assertEquals(RangeQuery::DEFAULT_BOOST_VALUE, $query['range']['field']['boost']);

        $this->assertArrayNotHasKey('_name', $query['range']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedRangeQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $rangeQuery = new RangeQuery('field', ['bounds'], 'queryName');
        $query = $assembler->assembleQuery($rangeQuery);

        $this->assertArrayHasKey('_name', $query['range']);
        $this->assertEquals('queryName', $query['range']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): RangeQueryAssembler
    {
        return new RangeQueryAssembler();
    }
}
