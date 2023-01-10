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
use Gally\Search\Elasticsearch\Request\Query\MatchQuery;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MatchQueryTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_MATCH);
    }

    public function testDefaultCreate(): void
    {
        /** @var MatchQuery $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MATCH,
            [
                'queryText' => 'little red riding hood',
                'field' => 'title',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('little red riding hood', $query->getQueryText());
        $this->assertEquals('title', $query->getField());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider matchQueryDataProvider
     *
     * @param string      $queryText          Query text
     * @param string      $field              Target field
     * @param string|null $minimumShouldMatch Minimum should match
     * @param string|null $name               Optional query name
     * @param float|null  $boost              Query boost
     */
    public function testCreateComplexParams(
        string $queryText,
        string $field,
        ?string $minimumShouldMatch,
        ?string $name,
        ?float $boost
    ): void {
        $queryParams = [
            'queryText' => $queryText,
            'field' => $field,
            'minimumShouldMatch' => $minimumShouldMatch,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && \strlen((string) $param);
            }
        );
        /** @var MatchQuery $query */
        $query = self::$queryFactory->create(QueryInterface::TYPE_MATCH, $queryParams);

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($queryText, $query->getQueryText());
        $this->assertEquals($field, $query->getField());
        if ($minimumShouldMatch) {
            $this->assertEquals($minimumShouldMatch, $query->getMinimumShouldMatch());
        }
        $this->assertEquals($name, $query->getName());
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function matchQueryDataProvider(): array
    {
        return [
            [
                'my query',
                'myField',
                null,
                null,
                null,
            ],
            [
                'my query',
                'myField',
                '3<75%',
                'custom minimum should match',
                null,
            ],
            [
                'my query',
                'myField',
                '3<75%',
                'custom boost',
                10,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(MatchQuery::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MATCH, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var MatchQuery $query */
        $this->assertIsString($query->getQueryText());
        $this->assertIsString($query->getField());
    }
}
