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
use Elasticsuite\Search\Elasticsearch\Request\Query\Missing;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class MissingTest extends KernelTestCase
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
        $query = self::$queryFactory->create(QueryInterface::TYPE_MISSING);
    }

    public function testDefaultCreate(): void
    {
        /** @var Missing $query */
        $query = self::$queryFactory->create(
            QueryInterface::TYPE_MISSING,
            [
                'field' => 'title',
            ]
        );
        $this->doStructureTest($query);

        $this->assertEquals('title', $query->getField());
        $this->assertNull($query->getName());
        $this->assertEquals(QueryInterface::DEFAULT_BOOST_VALUE, $query->getBoost());
    }

    /**
     * @dataProvider missingDataProvider
     *
     * @param string      $field Field to test existence of
     * @param string|null $name  Query name
     * @param float|null  $boost Query boost
     */
    public function testCreateComplexParams(
        string $field,
        ?string $name,
        ?float $boost
    ): void {
        $queryParams = [
            'field' => $field,
            'name' => $name,
            'boost' => $boost,
        ];
        $queryParams = array_filter(
            $queryParams,
            function ($param) {
                return null !== $param && \strlen((string) $param);
            }
        );
        /** @var Missing $query */
        $query = self::$queryFactory->create(QueryInterface::TYPE_MISSING, $queryParams);

        // Testing types.
        $this->doStructureTest($query);

        // Testing provided values.
        $this->assertEquals($field, $query->getField());
        $this->assertEquals($name, $query->getName());
        if ($boost) {
            $this->assertEquals($boost, $query->getBoost());
        }
    }

    public function missingDataProvider(): array
    {
        return [
            [
                'myField',
                null,
                null,
            ],
            [
                'myField',
                'query name',
                null,
            ],
            [
                'myField',
                'non standard boost',
                10,
            ],
        ];
    }

    private function doStructureTest(mixed $query): void
    {
        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertInstanceOf(Missing::class, $query);
        $this->assertEquals(QueryInterface::TYPE_MISSING, $query->getType());
        if ($query->getName()) {
            $this->assertIsString($query->getName());
        }
        $this->assertIsFloat($query->getBoost());

        /** @var Missing $query */
        $this->assertIsString($query->getField());
    }
}
