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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Liip\TestFixturesBundle\Services\DatabaseToolCollection;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter query assembler test case.
 */
class AssemblerTest extends KernelTestCase
{
    /**
     * Test assembling a valid query.
     */
    public function testAssembleValidQuery(): void
    {
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $query->method('getType')->willReturn('queryType');

        $this->assertEquals(['type' => 'queryType'], $this->getQueryAssembler()->assembleQuery($query));
    }

    /**
     * Test the query assembler throws an exception when using an invalid query type.
     */
    public function testAssembleInvalidQuery(): void
    {
        $this->expectExceptionMessage('Unknown query assembler for invalidQueryType.');
        $this->expectException(\InvalidArgumentException::class);
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $query->method('getType')->willReturn('invalidQueryType');

        $this->getQueryAssembler()->assembleQuery($query);
    }

    /**
     * Mock a query assembler.
     */
    private function getQueryAssembler(): QueryAssembler
    {
        $databaseTool = static::getContainer()->get(DatabaseToolCollection::class)->get();

        $queryAssemblerMock = $this->getMockBuilder(AssemblerInterface::class)->getMock();

        $assembleQueryCallback = function (QueryInterface $query) {
            return ['type' => $query->getType()];
        };

        $queryAssemblerMock->method('assembleQuery')->willReturnCallback($assembleQueryCallback);

        return new QueryAssembler(['queryType' => $queryAssemblerMock]);
    }
}
