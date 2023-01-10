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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\SignificantTerms as SignificantTermsAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\SignificantTerms;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter significant term aggregation assembler test case.
 */
class SignificantTermsTest extends KernelTestCase
{
    /**
     * Build a significant term aggregation from a bucket.
     */
    public function testBasicAggregationBuild(): void
    {
        $aggBuilder = new SignificantTermsAssembler();
        $bucket = new SignificantTerms('aggregationName', 'fieldName');

        $aggregation = $aggBuilder->assembleAggregation($bucket);

        $this->assertArrayHasKey('significant_terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['significant_terms']['field']);
        $this->assertEquals(100000, $aggregation['significant_terms']['size']);
        $this->assertEquals(5, $aggregation['significant_terms']['min_doc_count']);
        $this->assertArrayHasKey('gnd', $aggregation['significant_terms']);
    }

    /**
     * Build a significant term aggregation from a bucket.
     */
    public function testComplexeAggregationBuild(): void
    {
        $aggBuilder = new SignificantTermsAssembler();
        $bucket = new SignificantTerms(
            'aggregationName',
            'fieldName',
            [],
            null,
            null,
            null,
            12,
            10,
            SignificantTerms::ALGORITHM_PERCENTAGE,
        );

        $aggregation = $aggBuilder->assembleAggregation($bucket);

        $this->assertArrayHasKey('significant_terms', $aggregation);
        $this->assertEquals('fieldName', $aggregation['significant_terms']['field']);
        $this->assertEquals(12, $aggregation['significant_terms']['size']);
        $this->assertEquals(10, $aggregation['significant_terms']['min_doc_count']);
        $this->assertArrayNotHasKey('gnd', $aggregation['significant_terms']);
        $this->assertArrayHasKey('percentage', $aggregation['significant_terms']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     */
    public function testInvalidBucketAggregationBuild(): void
    {
        $aggBuilder = new SignificantTermsAssembler();
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $termsBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $termsBucket->method('getType')->willReturn('invalidType');

        $aggBuilder->assembleAggregation($termsBucket);
    }
}
