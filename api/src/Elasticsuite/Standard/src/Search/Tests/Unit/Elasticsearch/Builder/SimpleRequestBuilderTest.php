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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Builder;

use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Elasticsuite\Search\Elasticsearch\Builder\Request\SimpleRequestBuilder;
use Elasticsuite\Search\Elasticsearch\Request\Query\Exists;
use Elasticsuite\Search\Elasticsearch\Request\Query\Filtered;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\RequestFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class SimpleRequestBuilderTest extends KernelTestCase
{
    private static RequestFactoryInterface $requestFactory;

    private static QueryFactory $queryFactory;

    private static QueryBuilder $queryBuilder;

    private static SimpleRequestBuilder $requestBuilder;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(RequestFactoryInterface::class) instanceof RequestFactoryInterface);
        self::$requestFactory = static::getContainer()->get(RequestFactoryInterface::class);
        \assert(static::getContainer()->get(QueryFactory::class) instanceof QueryFactory);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
        self::$queryBuilder = new QueryBuilder(self::$queryFactory);
        self::$requestBuilder = new SimpleRequestBuilder(self::$requestFactory, self::$queryBuilder);
    }

    public function testInstantiate(): void
    {
        $reflector = new \ReflectionClass(SimpleRequestBuilder::class);
        $queryBuilderProperty = $reflector->getProperty('queryBuilder');
        $requestFactoryProperty = $reflector->getProperty('requestFactory');

        $simpleBuilder = new SimpleRequestBuilder(self::$requestFactory, self::$queryBuilder);
        $this->assertEquals($requestFactoryProperty->getValue($simpleBuilder), self::$requestFactory);
        $this->assertEquals($queryBuilderProperty->getValue($simpleBuilder), self::$queryBuilder);
    }

    public function testCreateNullQuery(): void
    {
        $request = self::$requestBuilder->create(
            'my_index',
            0,
            5
        );

        $this->assertEquals('raw', $request->getName());
        $this->assertEquals('my_index', $request->getIndex());
        $this->assertEquals(0, $request->getFrom());
        $this->assertEquals(5, $request->getSize());

        $query = $request->getQuery();
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Filtered::class, $query);
        /** @var Filtered $query */
        $this->assertEquals(QueryInterface::TYPE_FILTER, $query->getType());
        $this->assertNull($query->getName());
        $this->assertNull($query->getQuery());
        $this->assertNull($query->getFilter());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    public function testCreateObjectQuery(): void
    {
        $request = self::$requestBuilder->create(
            'my_index',
            0,
            5,
            self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['my_field'])
        );

        $this->assertEquals('raw', $request->getName());
        $this->assertEquals('my_index', $request->getIndex());
        $this->assertEquals(0, $request->getFrom());
        $this->assertEquals(5, $request->getSize());

        $query = $request->getQuery();
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Filtered::class, $query);
        /** @var Filtered $query */
        $this->assertEquals(QueryInterface::TYPE_FILTER, $query->getType());
        $this->assertNull($query->getName());
        $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
        $this->assertInstanceOf(Exists::class, $query->getQuery());
        $this->assertNull($query->getFilter());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    // TODO: implement fulltext queries first.
    /*
    public function testCreateStringQuery(): void
    {
        $request = self::$requestBuilder->create(
            'my_index',
            0,
            5,
            'my query'
        );

        $this->assertEquals('raw', $request->getName());
        $this->assertEquals('my_index', $request->getIndex());
        $this->assertEquals(0, $request->getFrom());
        $this->assertEquals(5, $request->getSize());
    }
    */
}
