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

use Elasticsuite\Search\Elasticsearch\Request\Query\Not;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class NotTest extends KernelTestCase
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
        /** @var Not $query */
        $query = self::$queryFactory->create(QueryInterface::TYPE_NOT);
        $this->doStructureTest($query);

        $this->assertNull($query->getQuery());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    public function testCreateComplexParams(): void
    {
        $tests = [
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'category.name']),
                null,
                null,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'category.name']),
                'negated exists query',
                null,
            ],
            [
                self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'category.name']),
                'negated exists query with boost',
                10,
            ],
            [
                self::$queryFactory->create(
                    QueryInterface::TYPE_BOOL,
                    [
                        'should' => [
                            self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'category.name']),
                            self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'brand']),
                        ],
                    ]
                ),
                null,
                null,
            ],
        ];

        foreach ($tests as $testParams) {
            $this->performCreateComplexParams(...$testParams);
        }
    }

    /**
     * @param QueryInterface|null $originalQuery Query to negate
     * @param string|null         $name          Query name
     * @param int|null            $boost         Query boost
     */
    private function performCreateComplexParams(
        ?QueryInterface $originalQuery,
        ?string $name,
        ?int $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'query' => $originalQuery,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && (\is_object($param) || \strlen((string) $param));
            }
        );
        /** @var Not $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_NOT,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        if ($originalQuery) {
            $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
            $this->assertEquals($originalQuery, $query->getQuery());
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
        $this->assertInstanceOf(Not::class, $query);
        $this->assertEquals(QueryInterface::TYPE_NOT, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsInt($query->getBoost());

        /** @var Not $query */
        if ($query->getQuery()) {
            $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
        }
    }
}
