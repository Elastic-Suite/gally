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

namespace Gally\Search\Tests\Unit\Elasticsearch\Builder\Request\SortOrder;

use Gally\Search\Elasticsearch\Builder\Request\SortOrder\Standard;
use Gally\Search\Elasticsearch\Request\SortOrderInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class StandardTest extends KernelTestCase
{
    /**
     * @dataProvider standardSortOrderDataProvider
     */
    public function testStandardSortOrder(
        string $field,
        ?string $direction,
        ?string $name,
        ?string $missing,
        string $expectedDirection,
        string $expectedMissing
    ): void {
        $params = [
            'field' => $field,
            'direction' => $direction,
            'name' => $name,
            'missing' => $missing,
        ];
        $params = array_filter($params);
        $sortOrder = new Standard(...$params); // @phpstan-ignore-line

        $this->assertEquals(SortOrderInterface::TYPE_STANDARD, $sortOrder->getType());
        $this->assertEquals($field, $sortOrder->getField());
        $this->assertEquals($name, $sortOrder->getName());
        $this->assertEquals($expectedDirection, $sortOrder->getDirection());
        $this->assertEquals($expectedMissing, $sortOrder->getMissing());
    }

    protected function standardSortOrderDataProvider(): array
    {
        return [
            [
                'name', // field.
                null,   // direction.
                null,   // name.
                null,   // missing.
                SortOrderInterface::SORT_ASC,     // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
            [
                'name', // field.
                null,   // direction.
                'my sort order', // name.
                null,   // missing.
                SortOrderInterface::SORT_ASC,     // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_ASC, // direction.
                null,   // name.
                null,   // missing.
                SortOrderInterface::SORT_ASC,     // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_DESC, // direction.
                null,   // name.
                null,   // missing.
                SortOrderInterface::SORT_DESC,     // expected direction.
                SortOrderInterface::MISSING_FIRST, // expected missing.
            ],
            [
                'name', // field.
                null,   // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_FIRST, // missing.
                SortOrderInterface::SORT_ASC,      // expected direction.
                SortOrderInterface::MISSING_FIRST, // expected missing.
            ],
            [
                'name', // field.
                null,   // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_LAST, // missing.
                SortOrderInterface::SORT_ASC,     // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_ASC, // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_FIRST, // missing.
                SortOrderInterface::SORT_ASC,      // expected direction.
                SortOrderInterface::MISSING_FIRST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_ASC, // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_LAST, // missing.
                SortOrderInterface::SORT_ASC,     // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_DESC, // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_FIRST, // missing.
                SortOrderInterface::SORT_DESC,     // expected direction.
                SortOrderInterface::MISSING_FIRST, // expected missing.
            ],
            [
                'name', // field.
                SortOrderInterface::SORT_DESC, // direction.
                'my sort order', // name.
                SortOrderInterface::MISSING_LAST, // missing.
                SortOrderInterface::SORT_DESC,    // expected direction.
                SortOrderInterface::MISSING_LAST, // expected missing.
            ],
        ];
    }
}
