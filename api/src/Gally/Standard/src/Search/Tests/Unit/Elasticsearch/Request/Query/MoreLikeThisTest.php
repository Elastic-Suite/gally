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
use Gally\Search\Elasticsearch\Request\Query\MoreLikeThis;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MoreLikeThisTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_MORELIKETHIS);
    }

    public function testDefaultCreate(): void
    {
        /** @var MoreLikeThis $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MORELIKETHIS,
            [
                'fields' => ['title', 'description'],
                'like' => 'little red riding hood',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals(['title', 'description'], $query->getFields());
        $this->assertEquals('little red riding hood', $query->getLike());
        $this->assertEquals(MoreLikeThis::DEFAULT_MINIMUM_SHOULD_MATCH, $query->getMinimumShouldMatch());
        $this->assertEquals(MoreLikeThis::DEFAULT_BOOST_TERMS, $query->getBoostTerms());
        $this->assertEquals(MoreLikeThis::DEFAULT_MIN_TERM_FREQ, $query->getMinTermFreq());
        $this->assertEquals(MoreLikeThis::DEFAULT_MIN_DOC_FREQ, $query->getMinDocFreq());
        $this->assertEquals(MoreLikeThis::DEFAULT_MAX_DOC_FREQ, $query->getMaxDocFreq());
        $this->assertEquals(MoreLikeThis::DEFAULT_MAX_QUERY_TERMS, $query->getMaxQueryTerms());
        $this->assertFalse($query->includeOriginalDocs());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider moreLikeThisDataProvider
     *
     * @param array        $fields              used fields
     * @param array|string $like                MLT like clause (doc ids or query string)
     * @param string|null  $minimumShouldMatch  minimum should match
     * @param float|null   $boostTerms          TF-IDF term boosting value
     * @param int|null     $minTermFreq         minimum term freq for a term to be considered
     * @param int|null     $minDocFreq          minimum doc freq for a term to be considered
     * @param int|null     $maxDocFreq          maximum doc freq for a term to be considered
     * @param int|null     $maxQueryTerms       maximum number of terms in generated queries
     * @param bool|null    $includeOriginalDocs whether to include original doc in the result set
     * @param string|null  $name                query name
     * @param float|null   $boost               query boost
     */
    public function testCreateComplexParams(
        array $fields,
        array|string $like,
        ?string $minimumShouldMatch,
        ?float $boostTerms,
        ?int $minTermFreq,
        ?int $minDocFreq,
        ?int $maxDocFreq,
        ?int $maxQueryTerms,
        ?bool $includeOriginalDocs,
        ?string $name,
        ?float $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'fields' => $fields,
            'like' => $like,
            'minimumShouldMatch' => $minimumShouldMatch,
            'boostTerms' => $boostTerms,
            'minTermFreq' => $minTermFreq,
            'minDocFreq' => $minDocFreq,
            'maxDocFreq' => $maxDocFreq,
            'maxQueryTerms' => $maxQueryTerms,
            'includeOriginalDocs' => $includeOriginalDocs,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        /** @var MoreLikeThis $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MORELIKETHIS,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($fields, $query->getFields());
        $this->assertEquals($like, $query->getLike());
        if ($minimumShouldMatch) {
            $this->assertEquals($minimumShouldMatch, $query->getMinimumShouldMatch());
        }
        if ($boostTerms) {
            $this->assertEquals($boostTerms, $query->getBoostTerms());
        }
        if ($minTermFreq) {
            $this->assertEquals($minTermFreq, $query->getMinTermFreq());
        }
        if ($minDocFreq) {
            $this->assertEquals($minDocFreq, $query->getMinDocFreq());
        }
        if ($maxDocFreq) {
            $this->assertEquals($maxDocFreq, $query->getMaxDocFreq());
        }
        if ($maxQueryTerms) {
            $this->assertEquals($maxQueryTerms, $query->getMaxQueryTerms());
        }
        if ($includeOriginalDocs) {
            $this->assertEquals($includeOriginalDocs, $query->includeOriginalDocs());
        }
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function moreLikeThisDataProvider(): array
    {
        return [
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                [
                    ['_id' => 1],
                    ['_id' => 2],
                ],
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                '1',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                '2<75%',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                10,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                2,
                25,
                75,
                null,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                2,
                null,
                null,
                10,
                null,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                2,
                null,
                null,
                10,
                true,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                2,
                null,
                null,
                10,
                false,
                null,
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                2,
                null,
                null,
                null,
                true,
                'more like this query',
                null,
            ],
            [
                ['title', 'description'],
                'little red riding hood',
                null,
                null,
                null,
                null,
                null,
                null,
                true,
                'more like this query^10',
                10,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(MoreLikeThis::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MORELIKETHIS, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var MoreLikeThis $query */
        $this->assertIsArray($query->getFields());
        $this->assertThat($query->getLike(), LogicalOr::fromConstraints(new IsType('string'), new IsType('array')));

        $this->assertIsFloat($query->getBoostTerms());
        $this->assertIsInt($query->getMinTermFreq());
        $this->assertIsInt($query->getMinDocFreq());
        $this->assertIsInt($query->getMaxDocFreq());
        $this->assertIsInt($query->getMaxQueryTerms());
        $this->assertIsBool($query->includeOriginalDocs());
    }
}
