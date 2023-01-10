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
use Gally\Search\Elasticsearch\Request\Query\Common as CommonQuery;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CommonQueryTest extends KernelTestCase
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
        $commonQuery = self::$queryFactory->create(QueryInterface::TYPE_COMMON);
    }

    public function testDefaultCreate(): void
    {
        $commonQuery = self::$queryFactory->create(QueryInterface::TYPE_COMMON, [
            'queryText' => 'foo',
            'field' => 'bar',
        ]);
        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $commonQuery);
        $this->assertInstanceOf(CommonQuery::class, $commonQuery);
        $this->doStructureTest($commonQuery);

        // Testing default values.
        $this->assertEquals('foo', $commonQuery->getQueryText());
        $this->assertEquals('bar', $commonQuery->getField());
        $this->assertNull($commonQuery->getName());
        $this->assertEquals(CommonQuery::DEFAULT_MINIMUM_SHOULD_MATCH, $commonQuery->getMinimumShouldMatch());
        $this->assertEquals(CommonQuery::DEFAULT_CUTOFF_FREQUENCY, $commonQuery->getCutoffFrequency());
        $this->assertEquals(CommonQuery::DEFAULT_BOOST_VALUE, $commonQuery->getBoost());
    }

    /**
     * @dataProvider commonQueryDataProvider
     *
     * @param string  $queryText          Matched text
     * @param string  $field              Query field
     * @param float   $cutoffFrequency    Cutoff frequency
     * @param string  $minimumShouldMatch Minimum should match for the match query
     * @param ?string $name               Query name
     * @param float   $boost              Query boost
     */
    public function testCreate(
        string $queryText,
        string $field,
        float $cutoffFrequency,
        string $minimumShouldMatch,
        ?string $name,
        float $boost
    ): void {
        $this->performCreateParamsTests($queryText, $field, $cutoffFrequency, $minimumShouldMatch, $name, $boost);
    }

    public function commonQueryDataProvider(): array
    {
        return [
            [
                'foo',
                'bar',
                0.1,
                '1',
                'searching foo in bar',
                1,
            ],
            [
                'foo',
                'bar',
                0.2,
                '3<90%',
                'searching bar in foo',
                2,
            ],
        ];
    }

    private function doStructureTest(mixed $commonQuery): void
    {
        /** @var CommonQuery $commonQuery */
        $this->assertEquals(QueryInterface::TYPE_COMMON, $commonQuery->getType());
        $this->assertIsString($commonQuery->getQueryText());
        $this->assertIsString($commonQuery->getField());
        $this->assertIsFloat($commonQuery->getCutoffFrequency());
        $this->assertIsString($commonQuery->getMinimumShouldMatch());
        $this->assertIsFloat($commonQuery->getBoost());
    }

    /**
     * @param string  $queryText          Matched text
     * @param string  $field              Query field
     * @param float   $cutoffFrequency    Cutoff frequency
     * @param string  $minimumShouldMatch Minimum should match for the match query
     * @param ?string $name               Query name
     * @param float   $boost              Query boost
     */
    private function performCreateParamsTests(
        string $queryText,
        string $field,
        float $cutoffFrequency,
        string $minimumShouldMatch,
        ?string $name,
        float $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'queryText' => $queryText,
            'field' => $field,
            'cutoffFrequency' => $cutoffFrequency,
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
        $commonQuery = self::$queryFactory->create(
            QueryInterface::TYPE_COMMON,
            $queryParams
        );

        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $commonQuery);
        $this->assertInstanceOf(CommonQuery::class, $commonQuery);
        $this->doStructureTest($commonQuery);

        // Testing provided values.
        $this->assertEquals($queryText, $commonQuery->getQueryText());
        $this->assertEquals($field, $commonQuery->getField());
        $this->assertEquals($cutoffFrequency, $commonQuery->getCutoffFrequency());
        $this->assertEquals($minimumShouldMatch, $commonQuery->getMinimumShouldMatch());
        $this->assertEquals($name, $commonQuery->getName());
        $this->assertEquals($boost, $commonQuery->getBoost());
    }
}
