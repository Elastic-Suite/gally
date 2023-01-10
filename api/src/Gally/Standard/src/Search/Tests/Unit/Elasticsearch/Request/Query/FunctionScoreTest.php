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
use Gally\Search\Elasticsearch\Request\Query\FunctionScore;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class FunctionScoreTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_FUNCTIONSCORE);
    }

    public function testDefaultCreate(): void
    {
        $originalQuery = self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']);
        $query = self::$queryFactory->create(QueryInterface::TYPE_FUNCTIONSCORE, [
            'query' => $originalQuery,
        ]);
        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(FunctionScore::class, $query);
        $this->doStructureTest($query);

        /** @var FunctionScore $query */
        // Testing default values.
        $this->assertEquals($originalQuery, $query->getQuery());
        $this->assertEquals([], $query->getFunctions());
        $this->assertNull($query->getName());
        $this->assertEquals(FunctionScore::SCORE_MODE_SUM, $query->getScoreMode());
        $this->assertEquals(FunctionScore::BOOST_MODE_SUM, $query->getBoostMode());
        $this->assertNull($query->getBoost());
    }

    public function testCreate(): void
    {
        $tests = [
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [],
                null,
                FunctionScore::SCORE_MODE_SUM,
                FunctionScore::BOOST_MODE_SUM,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [
                    self::$queryFactory->create(
                    QueryInterface::TYPE_COMMON,
                        [
                            'queryText' => 'value',
                            'field' => 'otherField',
                            'boost' => 10,
                        ]
                    ),
                ],
                'single function',
                FunctionScore::SCORE_MODE_AVG,
                FunctionScore::BOOST_MODE_AVG,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [
                    self::$queryFactory->create(
                        QueryInterface::TYPE_COMMON,
                        [
                            'queryText' => 'value',
                            'field' => 'otherField',
                            'boost' => 10,
                        ]
                    ),
                    self::$queryFactory->create(
                        QueryInterface::TYPE_TERMS,
                        [
                            'values' => ['red', 'green'],
                            'field' => 'color',
                            'boost' => 30,
                        ]
                    ),
                ],
                'two functions',
                FunctionScore::SCORE_MODE_FIRST,
                FunctionScore::BOOST_MODE_FIRST,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [
                    self::$queryFactory->create(
                        QueryInterface::TYPE_COMMON,
                        [
                            'queryText' => 'value',
                            'field' => 'otherField',
                            'boost' => 10,
                        ]
                    ),
                ],
                'score max boost min',
                FunctionScore::SCORE_MODE_MAX,
                FunctionScore::BOOST_MODE_MIN,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [
                    self::$queryFactory->create(
                        QueryInterface::TYPE_COMMON,
                        [
                            'queryText' => 'value',
                            'field' => 'otherField',
                            'boost' => 10,
                        ]
                    ),
                ],
                'score min boost max',
                FunctionScore::SCORE_MODE_MIN,
                FunctionScore::BOOST_MODE_MAX,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'myField']),
                [
                    self::$queryFactory->create(
                        QueryInterface::TYPE_COMMON,
                        [
                            'queryText' => 'value',
                            'field' => 'otherField',
                            'boost' => 10,
                        ]
                    ),
                ],
                'score mul boost mul',
                FunctionScore::SCORE_MODE_MULTIPLY,
                FunctionScore::BOOST_MODE_MULTIPLY,
            ],
        ];

        foreach ($tests as $testParams) {
            $this->performCreateParamsTests(...$testParams);
        }
    }

    private function doStructureTest(mixed $query): void
    {
        /** @var FunctionScore $query */
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(FunctionScore::class, $query);
        $this->assertEquals(QueryInterface::TYPE_FUNCTIONSCORE, $query->getType());
        $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
        $this->assertIsArray($query->getFunctions());
        if (!empty($query->getFunctions())) {
            $this->assertContainsOnlyInstancesOf(QueryInterface::class, $query->getFunctions());
        }
        $this->assertIsString($query->getScoreMode());
        $this->assertIsString($query->getBoostMode());
        $this->assertNull($query->getBoost());
    }

    /**
     * @param QueryInterface   $query     Original query
     * @param QueryInterface[] $functions Scoring functions
     * @param ?string          $name      Query name
     * @param string           $scoreMode Score mode
     * @param string           $boostMode Boost mode
     */
    private function performCreateParamsTests(
        QueryInterface $query,
        array $functions,
        ?string $name,
        string $scoreMode,
        string $boostMode
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'query' => $query,
            'functions' => $functions,
            'name' => $name,
            'scoreMode' => $scoreMode,
            'boostMode' => $boostMode,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                if (\is_array($param)) {
                    return !empty($param);
                }

                return null !== $param && (\is_object($param) || \strlen((string) $param));
            }
        );
        /** @var FunctionScore $functionScoreQuery */
        $functionScoreQuery = self::$queryFactory->create(QueryInterface::TYPE_FUNCTIONSCORE, $queryParams);

        // Testing types.
        $this->doStructureTest($functionScoreQuery);

        // Testing provided values.
        $this->assertEquals($query, $functionScoreQuery->getQuery());
        $this->assertEquals($functions, $functionScoreQuery->getFunctions());
        $this->assertEquals($name, $functionScoreQuery->getName());
        $this->assertEquals($scoreMode, $functionScoreQuery->getScoreMode());
        $this->assertEquals($boostMode, $functionScoreQuery->getBoostMode());
    }
}
