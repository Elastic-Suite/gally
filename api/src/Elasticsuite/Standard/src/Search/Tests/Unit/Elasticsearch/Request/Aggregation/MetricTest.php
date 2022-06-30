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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Aggregation;

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\AggregationFactory;
use Elasticsuite\Search\Elasticsearch\Request\MetricInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MetricTest extends KernelTestCase
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
        self::$aggregationFactory->create(MetricInterface::TYPE_SUM);
    }

    public function testInvalidType(): void
    {
        $this->expectException(\LogicException::class);
        self::$aggregationFactory->create(
            'invalidType',
            [
                'type' => 'invalidType',
                'name' => 'test_metric_name',
                'field' => 'test_field',
            ]
        );
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        $metric = self::$aggregationFactory->create($params['type'], $params);
        $this->doStructureTest($metric);
        $this->doContentTest($metric, $params);
    }

    public function createDataProvider(): iterable
    {
        yield [[
            'type' => 'avgMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'minMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'maxMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'sumMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'statsMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'extendedStatsMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'cardinalityMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
        ]];

        yield [[
            'type' => 'percentilesMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
            'interval' => [
                'percents' => [95, 99, 99.9],
            ],
        ]];

        yield [[
            'type' => 'percentilesMetric',
            'name' => 'test_metric_name',
            'field' => 'test_field',
            'sort' => [
                'date' => ['order' => 'desc'],
            ],
            '_source' => [
                'includes' => ['date', 'price'],
            ],
            'size' => 1,
        ]];
    }

    private function doStructureTest(mixed $metric): void
    {
        /** @var MetricInterface $metric */
        $this->assertInstanceOf(MetricInterface::class, $metric);

        $this->assertIsString($metric->getName());
        $this->assertIsString($metric->getType());
        $this->assertIsString($metric->getField());
        $this->assertIsArray($metric->getConfig());
    }

    private function doContentTest(mixed $metric, array $params): void
    {
        /** @var MetricInterface $metric */
        $this->assertEquals($params['name'], $metric->getName());
        $this->assertEquals($params['type'], $metric->getType());
        $this->assertEquals($params['field'], $metric->getField());
        $this->assertEquals($params['config'] ?? [], $metric->getConfig());
    }
}
