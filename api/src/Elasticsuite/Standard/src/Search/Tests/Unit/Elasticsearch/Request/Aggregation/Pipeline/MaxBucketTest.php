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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Pipeline;

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline\MaxBucket;
use Elasticsuite\Search\Elasticsearch\Request\AggregationFactory;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MaxBucketTest extends KernelTestCase
{
    private static AggregationFactory $aggregationFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(AggregationFactory::class) instanceof AggregationFactory);
        self::$aggregationFactory = static::getContainer()->get(AggregationFactory::class);
    }

    public function testFailedCreate(): void
    {
        $this->expectException(ArgumentCountError::class);
        self::$aggregationFactory->create(PipelineInterface::TYPE_MAX_BUCKET);
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        $pipeline = self::$aggregationFactory->create(PipelineInterface::TYPE_MAX_BUCKET, $params);
        $this->doStructureTest($pipeline);
        $this->doContentTest($pipeline, $params);
    }

    public function createDataProvider(): iterable
    {
        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
            'gapPolicy' => 'insert_zeros',
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
            'gapPolicy' => 'insert_zeros',
            'format' => '0.###E0 m/s',
        ]];
    }

    private function doStructureTest(mixed $pipeline): void
    {
        $this->assertInstanceOf(PipelineInterface::class, $pipeline);
        $this->assertInstanceOf(MaxBucket::class, $pipeline);
        $this->assertEquals(PipelineInterface::TYPE_MAX_BUCKET, $pipeline->getType());

        $this->assertIsString($pipeline->getName());
        $this->assertThat($pipeline->getBucketsPath(), LogicalOr::fromConstraints(new IsType('array'), new IsType('string'), new IsType('null')));
        $this->assertIsString($pipeline->getGapPolicy());
        $this->assertIsString($pipeline->getFormat());
    }

    private function doContentTest(mixed $pipeline, array $params): void
    {
        /** @var MaxBucket $pipeline */
        $this->assertEquals($params['name'], $pipeline->getName());
        $this->assertTrue($pipeline->hasBucketsPath());
        $this->assertEquals($params['bucketsPath'], $pipeline->getBucketsPath());
        $this->assertEquals($params['gapPolicy'] ?? PipelineInterface::GAP_POLICY_SKIP, $pipeline->getGapPolicy());
        $this->assertEquals($params['format'] ?? '', $pipeline->getFormat());
    }
}
