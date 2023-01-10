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

use ArgumentCountError;
use Elasticsuite\Search\Elasticsearch\Request\Query\Terms;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class TermsTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_TERMS);
    }

    public function testDefaultCreate(): void
    {
        /** @var Terms $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_TERMS,
            [
                'values' => ['red', 'green', 'blue'],
                'field' => 'color',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals(['red', 'green', 'blue'], $query->getValues());
        $this->assertEquals('color', $query->getField());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider termsDataProvider
     *
     * @param string|bool|array $values Search values
     * @param string            $field  Search field
     * @param ?string           $name   Query name
     * @param ?float            $boost  Query boost
     */
    public function testCreateComplexParams(
        string|bool|array $values,
        string $field,
        ?string $name,
        ?float $boost
    ): void {
        // TODO: use reflection to build mapping ?
        $queryParams = [
            'values' => $values,
            'field' => $field,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return \is_array($param) ? !empty($param) : (null !== $param && \strlen((string) $param));
            }
        );
        /** @var Terms $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_TERMS,
            $queryParams
        );

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        if (\is_string($values)) {
            $this->assertEquals(explode(',', $values), $query->getValues());
        } elseif (\is_bool($values)) {
            $this->assertEquals([$values], $query->getValues());
        } else {
            $this->assertEquals($values, $query->getValues());
        }
        $this->assertEquals($field, $query->getField());
        if ($name) {
            $this->assertEquals($name, $query->getName());
        }
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function termsDataProvider(): array
    {
        return [
            [
                'little',
                'title',
                null,
                null,
            ],
            [
                ['little', 'red', 'riding', 'hood'],
                'title',
                null,
                null,
            ],
            [
                true,
                'is_discounted',
                null,
                null,
            ],
            [
                ['little', 'red', 'riding', 'hood'],
                'title',
                'searching for the little red riding hood',
                null,
            ],
            [
                ['little', 'red', 'riding', 'hood'],
                'title',
                'searching for the little red riding hood w/ boost',
                25,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Terms::class, $query);
        $this->assertEquals(QueryInterface::TYPE_TERMS, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var Terms $query */
        $this->assertIsArray($query->getValues());
        $this->assertIsString($query->getField());
    }
}
