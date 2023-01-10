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

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket\QueryGroup as QueryGroupAssembler;
use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\QueryGroup;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search adapter query group aggregation assembler test case.
 */
class QueryGroupTest extends KernelTestCase
{
    /**
     * Build a query group aggregation from a bucket.
     */
    public function testBasicTermAggregationBuild(): void
    {
        $queries = [
            'filter1' => $this->getMockBuilder(QueryInterface::class)->getMock(),
            'filter2' => $this->getMockBuilder(QueryInterface::class)->getMock(),
        ];
        $queries['filter1']->method('getName')->willReturn('filter1');
        $queries['filter2']->method('getName')->willReturn('filter2');
        $bucket = new QueryGroup('aggregationName', $queries);
        $aggregation = $this->getQueryGroupAggregationAssembler()->assembleAggregation($bucket);

        $this->assertCount(2, $aggregation['filters']['filters']);
        $this->assertEquals(['filter1'], $aggregation['filters']['filters']['filter1']);
        $this->assertEquals(['filter2'], $aggregation['filters']['filters']['filter2']);
    }

    /**
     * Test an exception is thrown when using the term aggs builder with another bucket type.
     *
     * @return void
     */
    public function testInvalidBucketAggregationBuild()
    {
        $this->expectExceptionMessage('Aggregation assembler : invalid aggregation type invalidType.');
        $this->expectException(\InvalidArgumentException::class);
        $termsBucket = $this->getMockBuilder(BucketInterface::class)->getMock();
        $termsBucket->method('getType')->willReturn('invalidType');

        $this->getQueryGroupAggregationAssembler()->assembleAggregation($termsBucket);
    }

    /**
     * Get the query group assembler used in tests.
     */
    private function getQueryGroupAggregationAssembler(): QueryGroupAssembler
    {
        $queryBuilder = $this->getMockBuilder(QueryAssembler::class)->disableOriginalConstructor()->getMock();

        $assembleQueryCallback = function (QueryInterface $query) {
            return [$query->getName()];
        };

        $queryBuilder->method('assembleQuery')->willReturnCallback($assembleQueryCallback);

        return new QueryGroupAssembler($queryBuilder);
    }
}
