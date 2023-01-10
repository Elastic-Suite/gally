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

namespace Gally\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Pipeline;

use ArgumentCountError;
use Gally\Search\Elasticsearch\Request\Aggregation\Pipeline\BucketSelector;
use Gally\Search\Elasticsearch\Request\AggregationFactory;
use Gally\Search\Elasticsearch\Request\PipelineInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class BucketSelectorTest extends KernelTestCase
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
        self::$aggregationFactory->create(PipelineInterface::TYPE_BUCKET_SELECTOR);
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        $pipeline = self::$aggregationFactory->create(PipelineInterface::TYPE_BUCKET_SELECTOR, $params);
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
    }

    private function doStructureTest(mixed $pipeline): void
    {
        $this->assertInstanceOf(PipelineInterface::class, $pipeline);
        $this->assertInstanceOf(BucketSelector::class, $pipeline);
        $this->assertEquals(PipelineInterface::TYPE_BUCKET_SELECTOR, $pipeline->getType());

        $this->assertIsString($pipeline->getName());
        $this->assertThat($pipeline->getBucketsPath(), LogicalOr::fromConstraints(new IsType('array'), new IsType('string'), new IsType('null')));
        $this->assertIsString($pipeline->getScript());
        $this->assertIsString($pipeline->getGapPolicy());
    }

    private function doContentTest(mixed $pipeline, array $params): void
    {
        /** @var BucketSelector $pipeline */
        $this->assertEquals($params['name'], $pipeline->getName());
        $this->assertTrue($pipeline->hasBucketsPath());
        $this->assertEquals($params['bucketsPath'], $pipeline->getBucketsPath());
        $this->assertEquals($params['script'], $pipeline->getScript());
        $this->assertEquals($params['gapPolicy'] ?? PipelineInterface::GAP_POLICY_SKIP, $pipeline->getGapPolicy());
    }
}
