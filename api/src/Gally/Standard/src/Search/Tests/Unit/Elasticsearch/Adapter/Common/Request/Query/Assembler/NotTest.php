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

use Gally\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Not as NotQueryAssembler;
use Gally\Search\Elasticsearch\Request\Query\Not as NotQuery;

/**
 * Not search request query test case.
 */
class NotTest extends AbstractComplexQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousNotQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $notQuery = new NotQuery($this->getSubQueryMock('subquery'));
        $query = $assembler->assembleQuery($notQuery);

        $this->assertArrayHasKey('bool', $query);
        $this->assertArrayHasKey('must_not', $query['bool']);
        $this->assertEquals(['subquery'], current($query['bool']['must_not']));
        $this->assertEquals(NotQuery::DEFAULT_BOOST_VALUE, $query['bool']['boost']);

        $this->assertArrayNotHasKey('_name', $query['bool']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedNotQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $notQuery = new NotQuery($this->getSubQueryMock('subquery'), 'queryName');
        $query = $assembler->assembleQuery($notQuery);

        $this->assertArrayHasKey('_name', $query['bool']);
        $this->assertEquals('queryName', $query['bool']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): NotQueryAssembler
    {
        return new NotQueryAssembler($this->getParentQueryAssembler());
    }
}
