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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Builder\Request\SortOrder;

use Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Nested;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class NestedTest extends KernelTestCase
{
    private static QueryFactory $queryFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
    }

    /**
     * @dataProvider nestedSortOrderDataProvider
     */
    public function testNestedSortOrder(
        string $field,
        ?string $direction,
        string $nestedPath,
        ?array $nestedFilter,
        ?string $scoreMode,
        ?string $name,
        ?string $missing,
        string $expectedDirection,
        string $expectedMissing,
        string $expectedScoreMode
    ): void {
        $nestedFilterQuery = $nestedFilter;
        if (\is_array($nestedFilter)) {
            [$field, $value] = $nestedFilter;
            $nestedFilterQuery = self::$queryFactory->create(QueryInterface::TYPE_TERM, ['field' => $field, 'value' => $value]);
        }
        $params = [
            'field' => $field,
            'direction' => $direction,
            'nestedPath' => $nestedPath,
            'nestedFilter' => $nestedFilterQuery,
            'scoreMode' => $scoreMode,
            'name' => $name,
            'missing' => $missing,
        ];
        $params = array_filter($params);
        $sortOrder = new Nested(...$params); // @phpstan-ignore-line

        $this->assertEquals(SortOrderInterface::TYPE_NESTED, $sortOrder->getType());
        $this->assertEquals($field, $sortOrder->getField());
        $this->assertEquals($name, $sortOrder->getName());
        $this->assertEquals($expectedDirection, $sortOrder->getDirection());
        $this->assertEquals($expectedMissing, $sortOrder->getMissing());
        $this->assertEquals($expectedScoreMode, $sortOrder->getScoreMode());
        $this->assertEquals($nestedFilterQuery, $sortOrder->getNestedFilter());
        $this->assertEquals($nestedPath, $sortOrder->getNestedPath());
    }

    protected function nestedSortOrderDataProvider(): array
    {
        return [
            [
                'price.final_price',    // field.
                null,                   // direction.
                'price',                // nested path.
                null,                   // nested filter.
                null,                   // score mode.
                null,                   // name.
                null,                   // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_MIN, // expected score mode.
            ],
            [
                'price.final_price',    // field.
                null,                   // direction.
                'price',                // nested path.
                null,                   // nested filter.
                SortOrderInterface::SCORE_MODE_MAX, // score mode.
                'my sort order',        // name.
                null,                   // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_MAX, // expected score mode.
            ],
            [
                'price.final_price',        // field.
                SortOrderInterface::SORT_ASC,   // direction.
                'price',                    // nested path.
                ['price.group_id', '0'],    // nested filter.
                null,   // score mode.
                null,   // name.
                null,   // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_MIN, // expected score mode.
            ],
            [
                'price.final_price',        // field.
                SortOrderInterface::SORT_DESC,  // direction.
                'price',                    // nested path.
                ['price.group_id', '1'],    // nested filter.
                SortOrderInterface::SCORE_MODE_MIN,   // score mode.
                null,   // name.
                null,   // missing.
                SortOrderInterface::SORT_DESC,       // expected direction.
                SortOrderInterface::MISSING_FIRST,   // expected missing.
                SortOrderInterface::SCORE_MODE_MIN,  // expected score mode.
            ],
            [
                'price.final_price',        // field.
                null,                       // direction.
                'price',                    // nested path.
                ['price.group_id', '2'],    // nested filter.
                null,                       // score mode.
                'my sort order',            // name.
                SortOrderInterface::MISSING_FIRST,  // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_FIRST,  // expected missing.
                SortOrderInterface::SCORE_MODE_MIN, // expected score mode.
            ],
            [
                'stock.qty',        // field.
                null,               // direction.
                'stock',            // nested path.
                null,               // nested filter.
                SortOrderInterface::SCORE_MODE_MED, // score mode.
                'my sort order',    // name.
                SortOrderInterface::MISSING_LAST,   // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_MED, // expected score mode.
            ],
            [
                'stock.qty',        // field.
                SortOrderInterface::SORT_ASC,   // direction.
                'stock',            // nested path.
                null,               // nested filter.
                null,               // score mode.
                'my sort order',    // name.
                SortOrderInterface::MISSING_FIRST,  // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_FIRST,  // expected missing.
                SortOrderInterface::SCORE_MODE_MIN, // expected score mode.
            ],
            [
                'stock.qty',                    // field.
                SortOrderInterface::SORT_ASC,   // direction.
                'stock',                        // nested path.
                ['stock.is_in_stock', true],    // nested filter.
                SortOrderInterface::SCORE_MODE_SUM, // score mode.
                'my sort order',                    // name.
                SortOrderInterface::MISSING_LAST,   // missing.
                SortOrderInterface::SORT_ASC,       // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_SUM, // expected score mode.
            ],
            [
                'stock.qty',                    // field.
                SortOrderInterface::SORT_DESC,  // direction.
                'stock',                        // nested path.
                ['stock.is_in_stock', false],   // nested filter.
                null,                           // score mode.
                'my sort order',                // name.
                SortOrderInterface::MISSING_FIRST,  // missing.
                SortOrderInterface::SORT_DESC,      // expected direction.
                SortOrderInterface::MISSING_FIRST,  // expected missing.
                SortOrderInterface::SCORE_MODE_MIN, // expected score mode.
            ],
            [
                'stock.qty',                    // field.
                SortOrderInterface::SORT_DESC,  // direction.
                'stock',                        // nested path.
                ['stock.is_in_stock', false],   // nested filter.
                SortOrderInterface::SCORE_MODE_AVG, // score mode.
                'my sort order',                // name.
                SortOrderInterface::MISSING_LAST,   // missing.
                SortOrderInterface::SORT_DESC,      // expected direction.
                SortOrderInterface::MISSING_LAST,   // expected missing.
                SortOrderInterface::SCORE_MODE_AVG, // expected score mode.
            ],
        ];
    }
}
