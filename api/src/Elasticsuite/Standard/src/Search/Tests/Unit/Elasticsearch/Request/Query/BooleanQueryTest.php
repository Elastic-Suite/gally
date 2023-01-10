<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\Query\Boolean as BooleanQuery;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class BooleanQueryTest extends KernelTestCase
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
        $booleanQuery = self::$queryFactory->create(QueryInterface::TYPE_BOOL);
        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $booleanQuery);
        $this->assertInstanceOf(BooleanQuery::class, $booleanQuery);
        $this->doStructureTest($booleanQuery);

        // Testing default values.
        $this->assertEmpty($booleanQuery->getMust());
        $this->assertEmpty($booleanQuery->getShould());
        $this->assertEmpty($booleanQuery->getMustNot());
        $this->assertNull($booleanQuery->getName());
        $this->assertEquals(1, $booleanQuery->getMinimumShouldMatch());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $booleanQuery->getBoost());
        $this->assertFalse($booleanQuery->isCached());
    }

    /**
     * @dataProvider booleanQueryDataProvider
     *
     * @param array       $must               Must clauses
     * @param array       $should             Should clauses
     * @param array       $mustNot            MustNot clauses
     * @param int         $minimumShouldMatch Minimum should match
     * @param string|null $name               Optional query name
     * @param float       $boost              Query boost
     * @param bool        $cached             Enabled cache or not
     */
    public function testCreate(
        array $must,
        array $should,
        array $mustNot,
        int $minimumShouldMatch,
        ?string $name,
        float $boost,
        bool $cached
    ): void {
        $this->performCreateParamsTests($must, $should, $mustNot, $minimumShouldMatch, $name, $boost, $cached);
    }

    public function booleanQueryDataProvider(): array
    {
        return [
            [
                [],
                [],
                [],
                0,
                'isFalse',
                3,
                false,
            ],
            [
                [],
                [],
                [],
                1,
                'isTrue',
                3,
                true,
            ],
        ];
    }

    public function testCreateComplexParams(): void
    {
        $tests = [
            [
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search'])],
                [],
                [],
                0,
                'mustOnly',
                3,
                false,
            ],
            [
                [],
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search'])],
                [],
                0,
                'shouldOnly',
                3,
                false,
            ],
            [
                [],
                [],
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search'])],
                0,
                'mustNotOnly',
                3,
                false,
            ],
            [
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'search'])],
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'searchCopy'])],
                [self::$queryFactory->create(QueryInterface::TYPE_EXISTS, ['field' => 'searchForbidden'])],
                0,
                'allClauses',
                3,
                false,
            ],
        ];

        foreach ($tests as $test) {
            $this->performCreateParamsTests(...$test);
        }
    }

    private function doStructureTest(mixed $booleanQuery): void
    {
        /** @var BooleanQuery $booleanQuery */
        $this->assertEquals(QueryInterface::TYPE_BOOL, $booleanQuery->getType());
        $this->assertIsArray($booleanQuery->getMust());
        $this->assertContainsOnlyInstancesOf(QueryInterface::class, $booleanQuery->getMust());
        $this->assertIsArray($booleanQuery->getShould());
        $this->assertContainsOnlyInstancesOf(QueryInterface::class, $booleanQuery->getShould());
        $this->assertIsArray($booleanQuery->getMustNot());
        $this->assertContainsOnlyInstancesOf(QueryInterface::class, $booleanQuery->getMustNot());
        $this->assertIsFloat($booleanQuery->getBoost());
        $this->assertIsInt($booleanQuery->getMinimumShouldMatch());
        $this->assertIsBool($booleanQuery->isCached());
    }

    /**
     * @param array       $must               Must clauses
     * @param array       $should             Should clauses
     * @param array       $mustNot            MustNot clauses
     * @param int         $minimumShouldMatch Minimum should match
     * @param string|null $name               Optional query name
     * @param float       $boost              Query boost
     * @param bool        $cached             Enabled cache or not
     */
    private function performCreateParamsTests(
        array $must,
        array $should,
        array $mustNot,
        int $minimumShouldMatch,
        ?string $name,
        float $boost,
        bool $cached
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'must' => $must,
            'should' => $should,
            'mustNot' => $mustNot,
            'minimumShouldMatch' => $minimumShouldMatch,
            'name' => $name,
            'boost' => $boost,
            'cached' => $cached,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        $booleanQuery = self::$queryFactory->create(
            QueryInterface::TYPE_BOOL,
            $queryParams
        );

        // Testing types.
        $this->assertInstanceOf(QueryInterface::class, $booleanQuery);
        $this->assertInstanceOf(BooleanQuery::class, $booleanQuery);
        $this->doStructureTest($booleanQuery);

        // Testing provided values.
        $this->assertEquals($must, $booleanQuery->getMust());
        $this->assertEquals($should, $booleanQuery->getShould());
        $this->assertEquals($mustNot, $booleanQuery->getMustNot());
        $this->assertEquals($name, $booleanQuery->getName());
        $this->assertEquals($minimumShouldMatch, $booleanQuery->getMinimumShouldMatch());
        $this->assertEquals($boost, $booleanQuery->getBoost());
        $this->assertEquals($cached, $booleanQuery->isCached());
    }
}
