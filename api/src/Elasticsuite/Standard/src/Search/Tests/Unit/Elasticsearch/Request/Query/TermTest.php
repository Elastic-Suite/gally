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
use Elasticsuite\Search\Elasticsearch\Request\Query\Term;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use PHPUnit\Framework\Constraint\IsType;
use PHPUnit\Framework\Constraint\LogicalOr;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TermTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_TERM);
    }

    public function testDefaultCreate(): void
    {
        /** @var Term $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_TERM,
            [
                'value' => 'red',
                'field' => 'color',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('red', $query->getValue());
        $this->assertEquals('color', $query->getField());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider termDataProvider
     *
     * @param string|bool $value Search value
     * @param string      $field Search field
     * @param ?string     $name  Name of the query
     * @param ?int        $boost Query boost
     */
    public function testCreateComplexParams(
        string|bool $value,
        string $field,
        ?string $name,
        ?int $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'value' => $value,
            'field' => $field,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && (\is_bool($param) || \strlen((string) $param));
            }
        );
        /** @var Term $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_TERM,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($value, $query->getValue());
        $this->assertEquals($field, $query->getField());
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function termDataProvider(): array
    {
        return [
            [
                'red',
                'color',
                null,
                null,
            ],
            [
                true,
                'is_new',
                null,
                null,
            ],
            [
                'red',
                'color',
                'term query with name',
                null,
            ],
            [
                'red',
                'color',
                'term query with name and boost',
                15,
            ],
            [
                false,
                'is_discounted',
                null,
                20,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Term::class, $query);
        $this->assertEquals(QueryInterface::TYPE_TERM, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsInt($query->getBoost());

        /** @var Term $query */
        $this->assertThat($query->getValue(), LogicalOr::fromConstraints(new IsType('string'), new IsType('bool')));
        $this->assertIsString($query->getField());
    }
}
