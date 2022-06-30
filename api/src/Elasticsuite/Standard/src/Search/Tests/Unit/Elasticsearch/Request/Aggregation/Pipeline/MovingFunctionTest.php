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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Pipeline;

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Pipeline\MovingFunction;
use Elasticsuite\Search\Elasticsearch\Request\AggregationFactory;
use Elasticsuite\Search\Elasticsearch\Request\PipelineInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MovingFunctionTest extends KernelTestCase
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
        self::$aggregationFactory->create(PipelineInterface::TYPE_MOVING_FUNCTION);
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        $pipeline = self::$aggregationFactory->create(PipelineInterface::TYPE_MOVING_FUNCTION, $params);
        $this->doStructureTest($pipeline);
        $this->doContentTest($pipeline, $params);
    }

    public function createDataProvider(): iterable
    {
        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
            'script' => 'a + b = c',
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
            'script' => 'a + b = c',
            'gapPolicy' => 'insert_zeros',
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'bucketsPath' => 'test_field',
            'script' => 'a + b = c',
            'window' => 100,
            'gapPolicy' => 'insert_zeros',
        ]];
    }

    private function doStructureTest(mixed $pipeline): void
    {
        $this->assertInstanceOf(PipelineInterface::class, $pipeline);
        $this->assertInstanceOf(MovingFunction::class, $pipeline);
        $this->assertEquals(PipelineInterface::TYPE_MOVING_FUNCTION, $pipeline->getType());

        $this->assertIsString($pipeline->getName());
        $this->assertThat($pipeline->getBucketsPath(), LogicalOr::fromConstraints(new IsType('array'), new IsType('string'), new IsType('null')));
        $this->assertIsString($pipeline->getScript());
        $this->assertIsInt($pipeline->getWindow());
        $this->assertIsString($pipeline->getGapPolicy());
    }

    private function doContentTest(mixed $pipeline, array $params): void
    {
        /** @var MovingFunction $pipeline */
        $this->assertEquals($params['name'], $pipeline->getName());
        $this->assertTrue($pipeline->hasBucketsPath());
        $this->assertEquals($params['bucketsPath'], $pipeline->getBucketsPath());
        $this->assertEquals($params['script'], $pipeline->getScript());
        $this->assertEquals($params['window'] ?? 10, $pipeline->getWindow());
        $this->assertEquals($params['gapPolicy'] ?? PipelineInterface::GAP_POLICY_SKIP, $pipeline->getGapPolicy());
    }
}
