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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Terms as TermsQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Terms as TermsQuery;

/**
 * Terms search request query test case.
 */
class TermsTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousTermsQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $termsQuery = new TermsQuery('value', 'field');
        $query = $assembler->assembleQuery($termsQuery);

        $this->assertArrayHasKey('terms', $query);
        $this->assertArrayHasKey('field', $query['terms']);
        $this->assertEquals(['value'], $query['terms']['field']);
        $this->assertEquals(TermsQuery::DEFAULT_BOOST_VALUE, $query['terms']['boost']);
        $this->assertArrayNotHasKey('_name', $query['terms']);

        $termsQuery = new TermsQuery(['value'], 'field');
        $query = $assembler->assembleQuery($termsQuery);
        $this->assertEquals(['value'], $query['terms']['field']);

        $termsQuery = new TermsQuery(['value1', 'value2'], 'field');
        $query = $assembler->assembleQuery($termsQuery);
        $this->assertEquals(['value1', 'value2'], $query['terms']['field']);

        $termsQuery = new TermsQuery('value1,value2', 'field');
        $query = $assembler->assembleQuery($termsQuery);
        $this->assertEquals(['value1', 'value2'], $query['terms']['field']);

        // Not possible anymore.
        $termsQuery = new TermsQuery(true, 'field');
        $query = $assembler->assembleQuery($termsQuery);
        $this->assertEquals([true], $query['terms']['field']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedTermsQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $termsQuery = new TermsQuery('value', 'field', 'queryName');
        $query = $assembler->assembleQuery($termsQuery);

        $this->assertArrayHasKey('_name', $query['terms']);
        $this->assertEquals('queryName', $query['terms']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): TermsQueryAssembler
    {
        return new TermsQueryAssembler();
    }
}
