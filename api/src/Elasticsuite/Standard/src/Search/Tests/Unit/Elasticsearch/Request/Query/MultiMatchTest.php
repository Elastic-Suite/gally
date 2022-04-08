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
use Elasticsuite\Search\Elasticsearch\Request\Container\RelevanceConfiguration\FuzzinessConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\Query\MultiMatch;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MultiMatchTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_MULTIMATCH);
    }

    public function testDefaultCreate(): void
    {
        /** @var MultiMatch $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MULTIMATCH,
            [
                'queryText' => 'little red',
                'fields' => ['title', 'description'],
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('little red', $query->getQueryText());
        $this->assertEquals(['title', 'description'], $query->getFields());

        $this->assertEquals(MultiMatch::DEFAULT_MINIMUM_SHOULD_MATCH, $query->getMinimumShouldMatch());
        $this->assertEquals(MultiMatch::DEFAULT_TIE_BREAKER, $query->getTieBreaker());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
        $this->assertNull($query->getFuzzinessConfiguration());
        $this->assertNull($query->getCutoffFrequency());
        $this->assertEquals(MultiMatch::DEFAULT_MATCH_TYPE, $query->getMatchType());
    }

    /**
     * @dataProvider multiMatchDataProvider
     *
     * @param string                           $queryText          Query text to search
     * @param array                            $fields             Target fields
     * @param ?string                          $minimumShouldMatch Minimum should match
     * @param ?float                           $tieBreaker         Tie breaker config
     * @param ?string                          $name               Query name
     * @param ?int                             $boost              Query boost
     * @param ?FuzzinessConfigurationInterface $fuzzinessConfig    Fuzziness config
     * @param ?float                           $cutoffFrequency    Cut-off frequency
     * @param ?string                          $matchType          Match type
     */
    public function testCreateComplexParams(
        string $queryText,
        array $fields,
        ?string $minimumShouldMatch,
        ?float $tieBreaker,
        ?string $name,
        ?int $boost,
        ?FuzzinessConfigurationInterface $fuzzinessConfig,
        ?float $cutoffFrequency,
        ?string $matchType
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'queryText' => $queryText,
            'fields' => $fields,
            'minimumShouldMatch' => $minimumShouldMatch,
            'tieBreaker' => $tieBreaker,
            'name' => $name,
            'boost' => $boost,
            'fuzzinessConfig' => $fuzzinessConfig,
            'cutoffFrequency' => $cutoffFrequency,
            'matchType' => $matchType,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        /** @var MultiMatch $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MULTIMATCH,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($queryText, $query->getQueryText());
        $this->assertEquals($fields, $query->getFields());
        if ($minimumShouldMatch) {
            $this->assertEquals($minimumShouldMatch, $query->getMinimumShouldMatch());
        }
        if ($tieBreaker) {
            $this->assertEquals($tieBreaker, $query->getTieBreaker());
        }
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
        if ($fuzzinessConfig) {
            $this->assertEquals($fuzzinessConfig, $query->getFuzzinessConfiguration());
        }
        if ($cutoffFrequency) {
            $this->assertEquals($cutoffFrequency, $query->getCutoffFrequency());
        }
        if ($matchType) {
            $this->assertEquals($matchType, $query->getMatchType());
        }
    }

    public function multiMatchDataProvider(): array
    {
        return [
            [
                'little red riding hood',
                ['title', 'description'],
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                '1',
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                '2<75%',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                null,
                0.7,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                null,
                null,
                'multimatch query',
                null,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                null,
                null,
                'multimatch query custom boost',
                15,
                null,
                null,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description'],
                null,
                null,
                null,
                null,
                null,
                0.15,
                null,
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'best_fields',
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'most_fields',
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'cross_fields',
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'phrase',
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'phrase_prefix',
            ],
            [
                'little red riding hood',
                ['title', 'description', 'category', 'subject', 'author'],
                null,
                null,
                null,
                null,
                null,
                0.09,
                'bool_prefix',
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(MultiMatch::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MULTIMATCH, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsInt($query->getBoost());

        /** @var MultiMatch $query */
        $this->assertIsString($query->getQueryText());
        $this->assertIsArray($query->getFields());

        $this->assertIsString($query->getMinimumShouldMatch());
        $this->assertIsFloat($query->getTieBreaker());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsInt($query->getBoost());
        if ($query->getFuzzinessConfiguration()) {
            $this->assertInstanceOf(FuzzinessConfigurationInterface::class, $query->getFuzzinessConfiguration());
        }
        if ($query->getCutoffFrequency()) {
            $this->assertIsFloat($query->getCutoffFrequency());
        }
        $this->assertIsString($query->getMatchType());
    }
}
