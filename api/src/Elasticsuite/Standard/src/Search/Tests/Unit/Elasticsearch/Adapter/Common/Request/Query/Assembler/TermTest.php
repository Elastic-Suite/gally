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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Term as TermQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Term as TermQuery;

/**
 * Term search request query test case.
 */
class TermTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousTermQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $termQuery = new TermQuery('value', 'field');
        $query = $assembler->assembleQuery($termQuery);

        $this->assertArrayHasKey('term', $query);
        $this->assertArrayHasKey('field', $query['term']);
        $this->assertEquals('value', $query['term']['field']['value']);
        $this->assertEquals(TermQuery::DEFAULT_BOOST_VALUE, $query['term']['field']['boost']);

        $this->assertArrayNotHasKey('_name', $query['term']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedTermQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $termQuery = new TermQuery('value', 'field', 'queryName');
        $query = $assembler->assembleQuery($termQuery);

        $this->assertArrayHasKey('_name', $query['term']);
        $this->assertEquals('queryName', $query['term']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): TermQueryAssembler
    {
        return new TermQueryAssembler();
    }
}
