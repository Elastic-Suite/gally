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

namespace Gally\Search\Tests\Unit\Elasticsearch;

use Elasticsearch\Client;
use Gally\Search\Elasticsearch\Adapter;
use Gally\Search\Elasticsearch\Adapter\Common\Request;
use Gally\Search\Elasticsearch\Adapter\Common\Response;
use Gally\Search\Elasticsearch\Builder\Response\AggregationBuilder;
use Gally\Search\Elasticsearch\RequestInterface;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class AdapterTest extends KernelTestCase
{
    public function testSearchSuccess(): void
    {
        $mapper = $this->getMockMapper();
        $client = $this->getMockClient();
        $aggregationBuilder = $this->getMockAggregationBuilder();
        $logger = $this->getMockLogger();
        $request = $this->getMockRequest();

        $client->method('search')->willReturn(
            [
                'hits' => [
                    'hits' => [
                        [
                            'id' => '1',
                            '_score' => 1.1,
                            '_source' => [
                                ['field' => 'value'],
                            ],
                        ],
                        [
                            'id' => '2',
                            '_score' => 1.0,
                            '_source' => [
                                ['field1' => 'value1', 'field2' => 'value2'],
                            ],
                        ],
                    ],
                    'total' => ['value' => 2],
                ],
            ]
        );

        $logger->expects($this->never())->method('error');

        $adapter = new Adapter($mapper, $client, $aggregationBuilder, $logger);
        $response = $adapter->search($request);

        $this->assertInstanceOf(Response\QueryResponse::class, $response);
        $this->assertCount(2, $response);
    }

    public function testSearchFailure(): void
    {
        $mapper = $this->getMockMapper();
        $client = $this->getMockClient();
        $aggregationBuilder = $this->getMockAggregationBuilder();
        $logger = $this->getMockLogger();
        $request = $this->getMockRequest();

        $fakeExceptionMessage = 'An exception occurred somewhere.';

        $client->method('search')->willThrowException(new \Exception($fakeExceptionMessage));
        $logger->expects($this->once())->method('error')->with($fakeExceptionMessage);

        $adapter = new Adapter($mapper, $client, $aggregationBuilder, $logger);
        $response = $adapter->search($request);

        $this->assertInstanceOf(Response\QueryResponse::class, $response);
        $this->assertCount(0, $response);
    }

    private function getMockClient(): Client|MockObject
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    private function getMockMapper(): Request\Mapper|MockObject
    {
        $mockMapper = $this->getMockBuilder(Request\Mapper::class)->disableOriginalConstructor()->getMock();
        $mockMapper->method('assembleSearchRequest')->willReturn(['mock' => ['elasticsearch' => 'query']]);

        return $mockMapper;
    }

    private function getMockAggregationBuilder(): AggregationBuilder|MockObject
    {
        return $this->getMockBuilder(AggregationBuilder::class)->disableOriginalConstructor()->getMock();
    }

    private function getMockLogger(): LoggerInterface|MockObject
    {
        return $this->getMockBuilder(LoggerInterface::class)->disableOriginalConstructor()->getMock();
    }

    private function getMockRequest(): RequestInterface|MockObject
    {
        $mockRequest = $this->getMockBuilder(RequestInterface::class)->disableOriginalConstructor()->getMock();
        $mockRequest->method('getIndex')->willReturn('my_index');

        return $mockRequest;
    }
}
