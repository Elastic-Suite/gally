<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Nested as NestedQueryAssembler;
use Gally\Search\Elasticsearch\Request\Query\Nested as NestedQuery;

/**
 * Nested search request query test case.
 */
class NestedTest extends AbstractComplexQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousNestedQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $nestedQuery = new NestedQuery('nestedPath', $this->getSubQueryMock('subquery'));
        $query = $assembler->assembleQuery($nestedQuery);

        $this->assertArrayHasKey('nested', $query);
        $this->assertEquals('nestedPath', $query['nested']['path']);
        $this->assertEquals(['subquery'], $query['nested']['query']);
        $this->assertEquals(NestedQuery::SCORE_MODE_NONE, $query['nested']['score_mode']);
        $this->assertEquals(NestedQuery::DEFAULT_BOOST_VALUE, $query['nested']['boost']);

        $this->assertArrayNotHasKey('_name', $query['nested']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedNestedQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $nestedQuery = new NestedQuery('nestedPath', $this->getSubQueryMock('subquery'), NestedQuery::SCORE_MODE_NONE, 'queryName');
        $query = $assembler->assembleQuery($nestedQuery);

        $this->assertArrayHasKey('_name', $query['nested']);
        $this->assertEquals('queryName', $query['nested']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): NestedQueryAssembler
    {
        return new NestedQueryAssembler($this->getParentQueryAssembler());
    }
}
