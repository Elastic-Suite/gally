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

namespace Gally\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Bucket;

use ArgumentCountError;
use Gally\Search\Elasticsearch\Request\Aggregation\Bucket\QueryGroup;
use Gally\Search\Elasticsearch\Request\BucketInterface;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\Constraint\IsInstanceOf;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;

class QueryGroupTest extends AbstractBucketTest
{
    public function testFailedCreate(): void
    {
        $this->expectException(ArgumentCountError::class);
        self::$aggregationFactory->create(BucketInterface::TYPE_QUERY_GROUP);
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        /** @var QueryGroup $bucket */
        $bucket = self::$aggregationFactory->create(BucketInterface::TYPE_QUERY_GROUP, $params);

        $this->doStructureTest($bucket);
        $this->doContentTest($bucket, $params);

        $this->expectException(\LogicException::class);
        $bucket->getField();
    }

    public function createDataProvider(): iterable
    {
        $queryFactory = static::getContainer()->get(QueryFactory::class);
        yield [[
            'name' => 'test_bucket_name',
            'queries' => [
                $queryFactory->create(
                    QueryInterface::TYPE_TERM,
                    ['value' => 'red', 'field' => 'color']
                ),
                'filter' => $queryFactory->create(
                    QueryInterface::TYPE_TERM,
                    ['value' => 'red', 'field' => 'weight']
                ),
            ],
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'queries' => [
                $queryFactory->create(
                    QueryInterface::TYPE_TERM,
                    ['value' => 'red', 'field' => 'color']
                ),
                'filter' => $queryFactory->create(
                    QueryInterface::TYPE_TERM,
                    ['value' => 'red', 'field' => 'weight']
                ),
            ],
            'filter' => $queryFactory->create(
                QueryInterface::TYPE_TERM,
                ['value' => 'red', 'field' => 'color']
            ),
            'nestedFilter' => $queryFactory->create(
                QueryInterface::TYPE_EXISTS,
                ['field' => 'sku']
            ),
            'childAggregations' => [
                [
                    'type' => 'sumMetric',
                    'field' => 'test_field',
                ],
            ],
        ]];
    }

    protected function doStructureTest(mixed $bucket): void
    {
        $this->assertInstanceOf(BucketInterface::class, $bucket);
        $this->assertInstanceOf(QueryGroup::class, $bucket);
        $this->assertEquals(BucketInterface::TYPE_QUERY_GROUP, $bucket->getType());

        $this->assertIsString($bucket->getName());
        $this->assertIsArray($bucket->getChildAggregations());
        $this->assertThat($bucket->getNestedPath(), LogicalOr::fromConstraints(new IsType('string'), new IsType('null')));
        $this->assertThat($bucket->getFilter(), LogicalOr::fromConstraints(new IsInstanceOf(QueryInterface::class), new IsType('null')));
        $this->assertThat($bucket->getNestedFilter(), LogicalOr::fromConstraints(new IsInstanceOf(QueryInterface::class), new IsType('null')));
        $this->assertIsArray($bucket->getQueries());
    }

    protected function doContentTest(mixed $bucket, array $params): void
    {
        /** @var QueryGroup $bucket */
        $this->assertEquals($params['name'], $bucket->getName());
        $this->assertEquals($params['childAggregations'] ?? [], $bucket->getChildAggregations());
        $this->assertEquals($params['nestedPath'] ?? null, $bucket->getNestedPath());
        $this->assertEquals($params['filter'] ?? null, $bucket->getFilter());
        $this->assertEquals($params['nestedFilter'] ?? null, $bucket->getNestedFilter());
        $this->assertEquals($params['queries'], $bucket->getQueries());
    }
}
