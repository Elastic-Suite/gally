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

namespace Gally\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler;
use Gally\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Gally\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\MetricInterface;
use Gally\Search\Elasticsearch\Request\PipelineInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter aggregation assembler test case.
 */
class AssemblerTest extends KernelTestCase
{
    /**
     * Test assemble a simple aggregation.
     */
    public function testAssembleSimpleAggregations(): void
    {
        $aggregations = [
            $this->createBucket('aggregation1', 'bucketType'),
            $this->createMetric('aggregation2', 'metricType'),
            $this->createPipeline('aggregation3', 'pipelineType', 'path'),
        ];

        $aggregationsEs = $this->getAggregationAssembler()->assembleAggregations($aggregations);
        $this->assertCount(3, $aggregationsEs);

        for ($i = 1; $i <= 3; ++$i) {
            $aggregationName = sprintf('aggregation%s', $i);
            $this->processSimpleAggregationAssertions($aggregationName, $aggregationsEs);
        }
    }

    /**
     * Test assemble a nested aggregation.
     */
    public function testAssembleNestedAggregation(): void
    {
        $buckets = [$this->createNestedBucket('aggregation', 'bucketType')];
        $aggregations = $this->getAggregationAssembler()->assembleAggregations($buckets);

        $aggregation = $this->getAggregationByName($aggregations, 'aggregation');
        $this->assertArrayHasKey('nested', $aggregation);
        $this->assertArrayHasKey('path', $aggregation['nested']);
        $this->assertEquals('parent', $aggregation['nested']['path']);
        $this->assertCount(2, $aggregation);

        $aggregations = $this->getSubAggregations($aggregation);
        $this->processSimpleAggregationAssertions('aggregation', $aggregations);
    }

    /**
     * Test assemble a nested filter aggregation.
     *
     * @return void
     */
    public function testAssembleFilteredNestedAggregation()
    {
        $buckets = [$this->createFilteredNestedBucket('aggregation', 'bucketType')];
        $aggregations = $this->getAggregationAssembler()->assembleAggregations($buckets);

        $aggregation = $this->getAggregationByName($aggregations, 'aggregation');
        $this->assertArrayHasKey('nested', $aggregation);
        $this->assertArrayHasKey('path', $aggregation['nested']);
        $this->assertEquals('parent', $aggregation['nested']['path']);

        $aggregations = $this->getSubAggregations($aggregation);
        $aggregation = $this->getAggregationByName($aggregations, 'aggregation');
        $this->assertArrayHasKey('filter', $aggregation);
        $this->assertEquals(['query'], $aggregation['filter']);
        $this->assertCount(2, $aggregation);

        $aggregations = $this->getSubAggregations($aggregation);
        $this->processSimpleAggregationAssertions('aggregation', $aggregations);
    }

    /**
     * Test assemble a filtered aggregation.
     */
    public function testAssembleFilteredAggregation(): void
    {
        $buckets = [$this->createFilteredBucket('aggregation', 'bucketType')];
        $aggregations = $this->getAggregationAssembler()->assembleAggregations($buckets);

        $aggregation = $this->getAggregationByName($aggregations, 'aggregation');
        $this->assertArrayHasKey('filter', $aggregation);
        $this->assertEquals(['query'], $aggregation['filter']);
        $this->assertCount(2, $aggregation);

        $aggregations = $this->getSubAggregations($aggregation);
        $this->processSimpleAggregationAssertions('aggregation', $aggregations);
    }

    /**
     * Test an exception is thrown when trying to assemble a bucket which is not handled by the assembler.
     */
    public function testAssembleInvalidAggregation(): void
    {
        $this->expectExceptionMessage('Unknown aggregation assembler for invalidBucketType.');
        $this->expectException(\InvalidArgumentException::class);
        $buckets = [$this->createNestedBucket('aggregation', 'invalidBucketType')];
        $this->getAggregationAssembler()->assembleAggregations($buckets);
    }

    /**
     * Test assembling an aggregation with a simple pipeline aggregation.
     *
     * @return void
     */
    public function testAssemblePipelinedAggregation()
    {
        $buckets = [$this->createPipelinedBucket('aggregation', 'bucketType', 'pipeline', 'pipelineType')];
        $aggregations = $this->getAggregationAssembler()->assembleAggregations($buckets);

        $aggregation = $this->getAggregationByName($aggregations, 'aggregation');
        $subAggregations = $this->getSubAggregations($aggregation);
        $this->assertArrayHasKey('pipeline', $subAggregations);
        $this->assertEquals(['type' => 'pipelineType'], $subAggregations['pipeline']);
    }

    /**
     * Prepare the aggregation assembler used by the test case.
     */
    private function getAggregationAssembler(): Assembler
    {
        $queryAssembler = $this->getQueryAssembler();
        $aggregationAssemblerMock = $this->getMockBuilder(AssemblerInterface::class)->getMock();

        $assembleAggregationCallback = function (AggregationInterface $aggregation) {
            return ['type' => $aggregation->getType()];
        };
        $aggregationAssemblerMock->method('assembleAggregation')->willReturnCallback($assembleAggregationCallback);

        return new Assembler(
            $queryAssembler,
            [
                'bucketType' => $aggregationAssemblerMock,
                'pipelineType' => $aggregationAssemblerMock,
                'metricType' => $aggregationAssemblerMock,
            ]
        );
    }

    /**
     * Create a simple bucket.
     */
    private function createBucket(string $name, string $type, array $subAggregations = []): MockObject|BucketInterface
    {
        $bucket = $this->getMockBuilder(BucketInterface::class)->getMock();

        $bucket->method('getName')->willReturn($name);
        $bucket->method('getField')->willReturn($name);
        $bucket->method('getType')->willReturn($type);
        $bucket->method('getChildAggregations')->willReturn($subAggregations);

        return $bucket;
    }

    /**
     * Create a simple metric.
     */
    private function createMetric(string $name, string $type, ): MockObject|MetricInterface
    {
        $bucket = $this->getMockBuilder(MetricInterface::class)->getMock();

        $bucket->method('getName')->willReturn($name);
        $bucket->method('getField')->willReturn($name);
        $bucket->method('getType')->willReturn($type);

        return $bucket;
    }

    /**
     * Create a simple bucket.
     */
    private function createPipeline(string $name, string $type, string $bucketsPath): MockObject|PipelineInterface
    {
        $bucket = $this->getMockBuilder(PipelineInterface::class)->getMock();

        $bucket->method('getName')->willReturn($name);
        $bucket->method('getType')->willReturn($type);
        $bucket->method('getBucketsPath')->willReturn($bucketsPath);

        return $bucket;
    }

    /**
     * Create a nested bucket.
     */
    private function createNestedBucket(string $name, string $type): MockObject|BucketInterface
    {
        $bucket = $this->createBucket($name, $type);
        $bucket->method('isNested')->willReturn(true);
        $bucket->method('getNestedPath')->willReturn('parent');

        return $bucket;
    }

    /**
     * Create a nested filtered bucket.
     */
    private function createFilteredNestedBucket(string $name, string $type): MockObject|BucketInterface
    {
        $filter = $this->getMockBuilder(QueryInterface::class)->getMock();
        $bucket = $this->createBucket($name, $type);
        $bucket->method('isNested')->willReturn(true);
        $bucket->method('getNestedPath')->willReturn('parent');
        $bucket->method('getNestedFilter')->willReturn($filter);

        return $bucket;
    }

    /**
     * Create a filtered bucket.
     */
    private function createFilteredBucket(string $name, string $type): MockObject|BucketInterface
    {
        $filter = $this->getMockBuilder(QueryInterface::class)->getMock();
        $bucket = $this->createBucket($name, $type);
        $bucket->method('getFilter')->willReturn($filter);

        return $bucket;
    }

    /**
     * Create a bucket aggregation with a single pipeline.
     */
    private function createPipelinedBucket(string $name, string $type, string $pipelineName, string $pipelineType): MockObject|BucketInterface
    {
        return $this->createBucket($name, $type, [$this->createPipeline($pipelineName, $pipelineType, 'bucketPath')]);
    }

    /**
     * Mock a query assembler.
     */
    private function getQueryAssembler(): QueryAssembler
    {
        $queryAssemblerMock = $this->getMockBuilder(QueryAssembler::class)->getMock();
        $queryAssemblerMock->method('assembleQuery')->willReturn(['query']);

        return $queryAssemblerMock;
    }

    /**
     * Run assertion on a simple bucket.
     *
     * @param string $aggregationName aggregation name
     * @param array  $aggregations    parent aggregation
     */
    private function processSimpleAggregationAssertions(string $aggregationName, array $aggregations): void
    {
        $this->assertArrayHasKey($aggregationName, $aggregations);
        $this->assertArrayHasKey('type', $aggregations[$aggregationName]);
        $this->assertContains($aggregations[$aggregationName]['type'], ['bucketType', 'metricType', 'pipelineType']);
    }

    /**
     * Return an aggregation by name.
     */
    private function getAggregationByName(array $aggregations, string $aggregationName): array
    {
        $this->assertArrayHasKey($aggregationName, $aggregations);

        return $aggregations[$aggregationName];
    }

    /**
     * Return all sub-aggregations of parent aggregation.
     *
     * @param array $aggregation   parent aggregation
     * @param int   $expectedCount expected number of sub-aggregation
     */
    private function getSubAggregations(array $aggregation, int $expectedCount = 1): array
    {
        $this->assertArrayHasKey('aggregations', $aggregation);
        $this->assertCount($expectedCount, $aggregation['aggregations']);

        return $aggregation['aggregations'];
    }
}
