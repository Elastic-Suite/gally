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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\Query\Filtered as FilteredQuery;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class FilteredQueryTest extends KernelTestCase
{
    private static QueryFactory $queryFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(QueryFactory::class) instanceof QueryFactory);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
    }

    public function testDefaultCreate(): void
    {
        $filteredQuery = self::$queryFactory->create(QueryInterface::TYPE_FILTER);
        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $filteredQuery);
        $this->assertInstanceOf(FilteredQuery::class, $filteredQuery);
        $this->doStructureTest($filteredQuery);

        // Testing default values.
        $this->assertNull($filteredQuery->getQuery());
        $this->assertNull($filteredQuery->getFilter());
        $this->assertNull($filteredQuery->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $filteredQuery->getBoost());
    }

    /**
     * @dataProvider filteredQueryDataProvider
     *
     * @param ?QueryInterface $query  Query part of the filtered query
     * @param ?QueryInterface $filter Filter part of the filtered query
     * @param ?string         $name   Query name
     * @param float           $boost  Query boost
     */
    public function testCreate(
        ?QueryInterface $query,
        ?QueryInterface $filter,
        ?string $name,
        float $boost
    ): void {
        $this->performCreateParamsTests($query, $filter, $name, $boost);
    }

    public function filteredQueryDataProvider(): array
    {
        return [
            [
                null,
                null,
                'empty boosted 3',
                3,
            ],
            [
                null,
                null,
                'empty boosted 2',
                2,
            ],
        ];
    }

    public function testCreateComplexParams(): void
    {
        $tests = [
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search']),
                null,
                'queryOnly',
                1,
            ],
            [
                null,
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search']),
                'filterOnly',
                2,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search']),
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'searchCopy']),
                'queryAndFilter',
                3,
            ],
        ];

        foreach ($tests as $test) {
            $this->performCreateParamsTests(...$test);
        }
    }

    private function doStructureTest(mixed $filteredQuery): void
    {
        /** @var FilteredQuery $filteredQuery */
        $this->assertEquals(QueryInterface::TYPE_FILTER, $filteredQuery->getType());
        if (null !== $filteredQuery->getQuery()) {
            $this->assertInstanceOf(QueryInterface::class, $filteredQuery->getQuery());
        }
        if (null !== $filteredQuery->getFilter()) {
            $this->assertInstanceOf(QueryInterface::class, $filteredQuery->getFilter());
        }
        $this->assertIsFloat($filteredQuery->getBoost());
    }

    /**
     * @param ?QueryInterface $query  Query part of the filtered query
     * @param ?QueryInterface $filter Filter part of the filtered query
     * @param ?string         $name   Query name
     * @param float           $boost  Query boost
     */
    private function performCreateParamsTests(
        ?QueryInterface $query,
        ?QueryInterface $filter,
        ?string $name,
        float $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'query' => $query,
            'filter' => $filter,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && (\is_object($param) || \strlen((string) $param));
            }
        );
        $filteredQuery = self::$queryFactory->create(
            QueryInterface::TYPE_FILTER,
            $queryParams
        );

        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $filteredQuery);
        $this->assertInstanceOf(FilteredQuery::class, $filteredQuery);
        $this->doStructureTest($filteredQuery);

        // Testing provided values.
        $this->assertEquals($query, $filteredQuery->getQuery());
        $this->assertEquals($filter, $filteredQuery->getFilter());
        $this->assertEquals($name, $filteredQuery->getName());
        $this->assertEquals($boost, $filteredQuery->getBoost());
    }
}
