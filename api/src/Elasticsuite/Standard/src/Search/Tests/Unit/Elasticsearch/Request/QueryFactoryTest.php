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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request;

use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class QueryFactoryTest extends KernelTestCase
{
    /**
     * Test the query creation using the factory.
     */
    public function testQueryCreate(): void
    {
        $query = $this->getQueryFactory()->create('queryType', []);
        $this->assertInstanceOf(QueryInterface::class, $query);
    }

    /**
     * Test submitting an invalid query type throws an exception.
     */
    public function testInvalidQueryCreate(): void
    {
        $this->expectExceptionMessage('No factory found for query of type invalidQueryType');
        $this->expectException(\LogicException::class);
        $this->getQueryFactory()->create('invalidQueryType', []);
    }

    /**
     * Prepared a mocked query factory.
     */
    private function getQueryFactory(): QueryFactory
    {
        $queryMock = $this->getMockBuilder(QueryInterface::class)->getMock();

        $factoryName = sprintf('%s%s', QueryInterface::class, 'Factory');
        $queryFactoryClass = $this->getMockClass($factoryName, ['create']);
        $queryFactoryMock = $this->getMockBuilder($queryFactoryClass)
            ->onlyMethods(['create'])
            ->getMock();

        $queryFactoryMock->method('create')
            ->willReturn($queryMock);

        $factories = ['queryType' => $queryFactoryMock];

        return new QueryFactory($factories);
    }
}
