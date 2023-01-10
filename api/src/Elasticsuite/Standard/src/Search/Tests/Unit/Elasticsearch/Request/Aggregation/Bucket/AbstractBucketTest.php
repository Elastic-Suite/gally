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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Bucket;

use Elasticsuite\Search\Elasticsearch\Request\AggregationFactory;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\Constraint\IsInstanceOf;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

abstract class AbstractBucketTest extends KernelTestCase
{
    protected static AggregationFactory $aggregationFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(AggregationFactory::class) instanceof AggregationFactory);
        self::$aggregationFactory = static::getContainer()->get(AggregationFactory::class);
    }

    protected function doStructureTest(mixed $bucket): void
    {
        $this->assertInstanceOf(BucketInterface::class, $bucket);

        $this->assertIsString($bucket->getName());
        $this->assertIsString($bucket->getField());
        $this->assertIsArray($bucket->getChildAggregations());
        $this->assertThat($bucket->getNestedPath(), LogicalOr::fromConstraints(new IsType('string'), new IsType('null')));
        $this->assertThat($bucket->getFilter(), LogicalOr::fromConstraints(new IsInstanceOf(QueryInterface::class), new IsType('null')));
        $this->assertThat($bucket->getNestedFilter(), LogicalOr::fromConstraints(new IsInstanceOf(QueryInterface::class), new IsType('null')));
    }

    protected function doContentTest(mixed $bucket, array $params): void
    {
        $this->assertEquals($params['name'], $bucket->getName());
        $this->assertEquals($params['field'], $bucket->getField());
        $this->assertEquals($params['childAggregations'] ?? [], $bucket->getChildAggregations());
        $this->assertEquals($params['nestedPath'] ?? null, $bucket->getNestedPath());
        $this->assertEquals($params['filter'] ?? null, $bucket->getFilter());
        $this->assertEquals($params['nestedFilter'] ?? null, $bucket->getNestedFilter());
    }
}
