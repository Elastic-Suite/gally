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

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\Query\Range;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class RangeTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_RANGE);
    }

    public function testDefaultCreate(): void
    {
        /** @var Range $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_RANGE,
            [
                'field' => 'width',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('width', $query->getField());
        $this->assertEmpty($query->getBounds());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider rangeDataProvider
     *
     * @param string      $field  Query field
     * @param array       $bounds Range filter bounds (authorized entries : gt, lt, lte, gte)
     * @param string|null $name   Query name
     * @param int|null    $boost  Query boost
     */
    public function testCreateComplexParams(
        string $field,
        array $bounds,
        ?string $name,
        ?int $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'field' => $field,
            'bounds' => $bounds,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        /** @var Range $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_RANGE,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($field, $query->getField());
        $this->assertEquals($bounds, $query->getBounds());
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function rangeDataProvider(): array
    {
        return [
            [
                'price',
                ['gte' => 15.50, 'lt' => 35.25],
                null,
                null,
            ],
            [
                'price',
                ['gte' => 15.50, 'lt' => 35.25],
                'range query',
                null,
            ],
            [
                'price',
                ['gte' => 15.50, 'lt' => 35.25],
                'range query with boost',
                15,
            ],
            [
                'price',
                ['gte' => 15.50, 'lt' => 35.25],
                null,
                10,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Range::class, $query);
        $this->assertEquals(QueryInterface::TYPE_RANGE, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsInt($query->getBoost());

        /** @var Range $query */
        $this->assertIsString($query->getField());
        $this->assertIsArray($query->getBounds());
    }
}
