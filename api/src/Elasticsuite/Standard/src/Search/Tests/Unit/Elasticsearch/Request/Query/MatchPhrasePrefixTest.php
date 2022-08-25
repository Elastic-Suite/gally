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
use Elasticsuite\Search\Elasticsearch\Request\Query\MatchPhrasePrefix;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MatchPhrasePrefixTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_MATCHPHRASEPREFIX);
    }

    public function testDefaultCreate(): void
    {
        /** @var MatchPhrasePrefix $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MATCHPHRASEPREFIX,
            [
                'queryText' => 'little red riding',
                'field' => 'title',
            ]
        );
        $this->doStructureTest($query);
        $this->assertEquals('little red riding', $query->getQueryText());
        $this->assertEquals('title', $query->getField());
        $this->assertEquals(10, $query->getMaxExpansions());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider matchPhrasePrefixDataProvider
     *
     * @param string      $queryText     Query text
     * @param string      $field         Target field
     * @param int|null    $maxExpansions Max expansions
     * @param string|null $name          Optional query name
     * @param float|null  $boost         Query boost
     */
    public function testCreateComplexParams(
        string $queryText,
        string $field,
        ?int $maxExpansions,
        ?string $name,
        ?float $boost
    ): void {
        $queryParams = [
            'queryText' => $queryText,
            'field' => $field,
            'maxExpansions' => $maxExpansions,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && \strlen((string) $param);
            }
        );
        /** @var MatchPhrasePrefix $query */
        $query = self::$queryFactory->create(QueryInterface::TYPE_MATCHPHRASEPREFIX, $queryParams);

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($queryText, $query->getQueryText());
        $this->assertEquals($field, $query->getField());
        if ($maxExpansions) {
            $this->assertEquals($maxExpansions, $query->getMaxExpansions());
        }
        $this->assertEquals($name, $query->getName());
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function matchPhrasePrefixDataProvider(): array
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
                2,
                null,
                null,
            ],
            [
                'my query',
                'myField',
                5,
                '5 expansions',
                null,
            ],
            [
                'my query',
                'myField',
                10,
                '10 expansions',
                10,
            ],
            [
                'my query',
                'myField',
                20,
                '20 expansions',
                null,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(MatchPhrasePrefix::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MATCHPHRASEPREFIX, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var MatchPhrasePrefix $query */
        $this->assertIsString($query->getQueryText());
        $this->assertIsString($query->getField());
        $this->assertIsInt($query->getMaxExpansions());
    }
}
