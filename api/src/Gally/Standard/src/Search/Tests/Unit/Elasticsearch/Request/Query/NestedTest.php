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

namespace Gally\Search\Tests\Unit\Elasticsearch\Request\Query;

use ArgumentCountError;
use Gally\Search\Elasticsearch\Request\Query\Nested;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class NestedTest extends KernelTestCase
{
    private static QueryFactory $queryFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        \assert(static::getContainer()->get(QueryFactory::class) instanceof QueryFactory);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
    }

    public function testFailedCreate(): void
    {
        $this->expectException(ArgumentCountError::class);
        $query = self::$queryFactory->create(QueryInterface::TYPE_NESTED);
    }

    public function testDefaultCreate(): void
    {
        /** @var Nested $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_NESTED,
            [
                'path' => 'price',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('price', $query->getPath());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    public function testCreateComplexParams(): void
    {
        $tests = [
            [
                'category',
                null,
                null,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'little,red', 'field' => 'category.name']),
                Nested::SCORE_MODE_AVG,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'riding,hood', 'field' => 'category.name']),
                Nested::SCORE_MODE_SUM,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'little,red', 'field' => 'category.name']),
                Nested::SCORE_MODE_MIN,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'riding,hood', 'field' => 'category.name']),
                Nested::SCORE_MODE_MAX,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'little,red', 'field' => 'category.name']),
                Nested::SCORE_MODE_NONE,
                null,
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'riding,hood', 'field' => 'category.name']),
                Nested::SCORE_MODE_NONE,
                'nested query for category.name',
                null,
            ],
            [
                'category',
                self::$queryFactory->create(QueryInterface::TYPE_TERMS, ['values' => 'riding,hood', 'field' => 'category.name']),
                Nested::SCORE_MODE_NONE,
                'nested query for category.name with boost',
                10,
            ],
        ];

        foreach ($tests as $testParams) {
            $this->performCreateComplexParams(...$testParams);
        }
    }

    /**
     * @param string              $path          Nested path
     * @param QueryInterface|null $originalQuery Nested query
     * @param string|null         $scoreMode     Score mode of the nested query
     * @param string|null         $name          Query name
     * @param float|null          $boost         Query boost
     */
    private function performCreateComplexParams(
        string $path,
        ?QueryInterface $originalQuery,
        ?string $scoreMode,
        ?string $name,
        ?float $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'path' => $path,
            'query' => $originalQuery,
            'scoreMode' => $scoreMode,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && (\is_object($param) || \strlen((string) $param));
            }
        );
        /** @var Nested $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_NESTED,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($path, $query->getPath());
        if ($originalQuery) {
            $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
            $this->assertEquals($originalQuery, $query->getQuery());
        }
        if ($scoreMode) {
            $this->assertEquals($scoreMode, $query->getScoreMode());
        }
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Nested::class, $query);
        $this->assertEquals(QueryInterface::TYPE_NESTED, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var Nested $query */
        $this->assertIsString($query->getPath());
        if ($query->getQuery()) {
            $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
        }
        $this->assertIsString($query->getScoreMode());
    }
}
