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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Pipeline\MovingFunction as MovingFunctionAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline\MovingFunction;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter moving function aggregation assembler test case.
 */
class MovingFunctionTest extends KernelTestCase
{
    /**
     * Build a moving function aggregation from a bucket.
     */
    public function testBasicAggregationBuild(): void
    {
        $aggBuilder = new MovingFunctionAssembler();
        $pipeline = new MovingFunction('aggregationName', 'bucket.path', 'testScript');

        $aggregation = $aggBuilder->assembleAggregation($pipeline);

        $this->assertArrayHasKey('moving_fn', $aggregation);
        $this->assertEquals('bucket.path', $aggregation['moving_fn']['buckets_path']);
        $this->assertEquals('testScript', $aggregation['moving_fn']['script']);
        $this->assertEquals(10, $aggregation['moving_fn']['window']);
        $this->assertEquals(PipelineInterface::GAP_POLICY_SKIP, $aggregation['moving_fn']['gap_policy']);
    }

    /**
     * Build a moving function aggregation from a bucket.
     */
    public function testComplexeAggregationBuild(): void
    {
        $aggBuilder = new MovingFunctionAssembler();
        $pipeline = new MovingFunction('aggregationName', 'bucket.path', 'testScript', 20, PipelineInterface::GAP_POLICY_INSERT_ZEROS);

        $aggregation = $aggBuilder->assembleAggregation($pipeline);

        $this->assertArrayHasKey('moving_fn', $aggregation);
        $this->assertEquals('bucket.path', $aggregation['moving_fn']['buckets_path']);
        $this->assertEquals('testScript', $aggregation['moving_fn']['script']);
        $this->assertEquals(20, $aggregation['moving_fn']['window']);
        $this->assertEquals(PipelineInterface::GAP_POLICY_INSERT_ZEROS, $aggregation['moving_fn']['gap_policy']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $aggBuilder = new MovingFunctionAssembler();
        $this->expectExceptionMessage('Aggregation assembler : invalid pipeline type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $pipeline = $this->getMockBuilder(PipelineInterface::class)->getMock();
        $pipeline->method('getType')->willReturn('invalidType');

        $aggBuilder->assembleAggregation($pipeline);
    }
}
