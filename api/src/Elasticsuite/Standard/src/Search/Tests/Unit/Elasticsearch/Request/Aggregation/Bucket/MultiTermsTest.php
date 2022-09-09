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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Aggregation\Bucket;

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\MultiTerms;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\MetricInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;

class MultiTermsTest extends AbstractBucketTest
{
    public function testFailedCreate(): void
    {
        $this->expectException(ArgumentCountError::class);
        self::$aggregationFactory->create(BucketInterface::TYPE_MULTI_TERMS);
    }

    /**
     * @dataProvider createDataProvider
     */
    public function testDefaultCreate(array $params): void
    {
        /** @var MultiTerms $bucket */
        $bucket = self::$aggregationFactory->create(BucketInterface::TYPE_MULTI_TERMS, $params);

        $this->doStructureTest($bucket);
        $this->doContentTest($bucket, $params);
    }

    public function createDataProvider(): iterable
    {
        $queryFactory = static::getContainer()->get(QueryFactory::class);
        yield [[
            'name' => 'test_bucket_name',
            'field' => 'test_field',
            'additionalFields' => ['other_field'],
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'test_field',
            'additionalFields' => ['other_field'],
            'size' => 10,
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'created_at',
            'additionalFields' => ['author'],
            'nestedPath' => 'category',
            'size' => 10,
            'minDocCount' => 10,
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'created_at',
            'additionalFields' => ['author'],
            'nestedPath' => 'category',
            'size' => 10,
            'minDocCount' => 10,
            'sortOrder' => BucketInterface::SORT_ORDER_RELEVANCE,
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'created_at',
            'additionalFields' => ['author'],
            'nestedPath' => 'category',
            'size' => 10,
            'minDocCount' => 10,
            'sortOrder' => BucketInterface::SORT_ORDER_RELEVANCE,
            'include' => [
                'red',
                'blue',
            ],
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'created_at',
            'additionalFields' => ['author'],
            'nestedPath' => 'category',
            'size' => 10,
            'minDocCount' => 10,
            'sortOrder' => BucketInterface::SORT_ORDER_RELEVANCE,
            'exclude' => [
                'red',
                'blue',
            ],
        ]];

        yield [[
            'name' => 'test_bucket_name',
            'field' => 'ca',
            'additionalFields' => ['author'],
            'interval' => '2y',
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
                    'type' => MetricInterface::TYPE_SUM,
                    'field' => 'test_field',
                ],
            ],
        ]];
    }

    protected function doStructureTest(mixed $bucket): void
    {
        parent::doStructureTest($bucket);
        $this->assertInstanceOf(MultiTerms::class, $bucket);
        $this->assertEquals(BucketInterface::TYPE_MULTI_TERMS, $bucket->getType());

        $this->assertIsInt($bucket->getSize());
        $this->assertIsString($bucket->getSortOrder());
        $this->assertIsArray($bucket->getInclude());
        $this->assertIsArray($bucket->getExclude());
        $this->assertThat($bucket->getMinDocCount(), LogicalOr::fromConstraints(new IsType('null'), new IsType('int')));
        $this->assertIsArray($bucket->getFields());
    }

    protected function doContentTest(mixed $bucket, array $params): void
    {
        parent::doContentTest($bucket, $params);

        /** @var MultiTerms $bucket */
        $this->assertEquals($params['size'] ?? BucketInterface::MAX_BUCKET_SIZE, $bucket->getSize());
        $this->assertEquals($params['sortOrder'] ?? BucketInterface::SORT_ORDER_COUNT, $bucket->getSortOrder());
        $this->assertEquals($params['include'] ?? [], $bucket->getInclude());
        $this->assertEquals($params['exclude'] ?? [], $bucket->getExclude());
        $this->assertEquals($params['minDocCount'] ?? null, $bucket->getMinDocCount());
        $this->assertEquals(array_merge([$params['field']], $params['additionalFields']), $bucket->getFields());
    }
}
