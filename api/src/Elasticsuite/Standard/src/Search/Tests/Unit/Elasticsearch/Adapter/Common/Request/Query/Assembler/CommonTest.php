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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Common as CommonQueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Query\Common as CommonQuery;

/**
 * Common search request query test case.
 */
class CommonTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousCommonQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $commonQuery = new CommonQuery('search text', 'searchField');
        $query = $assembler->assembleQuery($commonQuery);

        $this->assertArrayHasKey('common', $query);
        $this->assertArrayHasKey('searchField', $query['common']);
        $this->assertEquals('search text', $query['common']['searchField']['query']);
        $this->assertEquals(CommonQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $query['common']['searchField']['minimum_should_match']);
        $this->assertEquals(CommonQuery::DEFAULT_CUTOFF_FREQUENCY, $query['common']['searchField']['cutoff_frequency']);
        $this->assertEquals(CommonQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $query['common']['searchField']['minimum_should_match']);

        $this->assertArrayNotHasKey('_name', $query['common']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedCommonQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $commonQuery = new CommonQuery(
            'search text',
            'searchField',
            CommonQuery::DEFAULT_CUTOFF_FREQUENCY,
            CommonQuery::DEFAULT_MINIMUM_SHOULD_MATCH,
            'queryName',
            CommonQuery::DEFAULT_BOOST_VALUE
        );

        $query = $assembler->assembleQuery($commonQuery);

        $this->assertArrayHasKey('_name', $query['common']);
        $this->assertEquals('queryName', $query['common']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): CommonQueryAssembler
    {
        return new CommonQueryAssembler();
    }
}
