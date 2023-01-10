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

namespace Gally\Product\Tests\Unit\Service;

use Elasticsearch\Client;
use Gally\Catalog\Model\Catalog;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Category\Repository\CategoryConfigurationRepository;
use Gally\Index\Model\Index;
use Gally\Product\Service\CategoryNameUpdater;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * To avoid other test messing with the static variable inside CategoryNameUpdater (yes, static are bad).
 */
class CategoryNameUpdaterTest extends KernelTestCase
{
    public function testUpdateSuccess(): void
    {
        $localizedCatalog = $this->getMockLocalizedCatalog();
        $localizedCatalog->method('getCatalog')->willReturn(new Catalog());
        $localizedCatalog->method('getId')->willReturn(1);

        $index = new Index('my_product_index');
        $index->setLocalizedCatalog($localizedCatalog);

        $categoryConfigRepository = $this->getMockCategoryConfigurationRepository();
        $categoryConfigRepository->method('findMergedByContext')
            ->willReturn([
                ['id' => 1, 'category_id' => 'one', 'name' => 'One', 'useNameInProductSearch' => 0],
                ['id' => 2, 'category_id' => 'two', 'name' => 'Two (DB name)', 'useNameInProductSearch' => 1],
                ['id' => 5, 'category_id' => 'three', 'name' => 'Three', 'useNameInProductSearch' => 1],
            ]);
        $client = $this->getMockClient();
        $logger = $this->getMockLogger();

        $productDataBulk = [
            ['id' => 37, 'name' => 'Product 37', 'category' => [['id' => 'one']]], // No expected update.
            ['id' => 121, 'name' => 'Product 121', 'category' => [['id' => 'one'], ['id' => 'two', 'name' => 'Two (Bulk name)']]],
            ['id' => 2, 'name' => 'Product 2', 'category' => [['id' => 'two', 'name' => 'Two (Bulk name)'], ['id' => 'three']]],
        ];

        $client->expects($this->exactly(2))->method('update')->withConsecutive(
            [
                [
                    'id' => 121,
                    'index' => 'my_product_index',
                    'body' => [
                        'doc' => [
                            'category' => [
                                ['id' => 'one'],
                                ['id' => 'two', 'name' => 'Two (Bulk name)', '_name' => 'Two (Bulk name)'],
                            ],
                        ],
                    ],
                    'refresh' => 'wait_for',
                    'timeout' => '500ms',
                ],
            ],
            [
                [
                    'id' => 2,
                    'index' => 'my_product_index',
                    'body' => [
                        'doc' => [
                            'category' => [
                                ['id' => 'two', 'name' => 'Two (Bulk name)', '_name' => 'Two (Bulk name)'],
                                ['id' => 'three', 'name' => 'Three', '_name' => 'Three'],
                            ],
                        ],
                    ],
                    'refresh' => 'wait_for',
                    'timeout' => '500ms',
                ],
            ]
        );

        $categoryNameUpdater = new CategoryNameUpdater($categoryConfigRepository, $client, $logger);
        $categoryNameUpdater->updateCategoryNames($index, $productDataBulk);
    }

    public function testUpdateFailure(): void
    {
        $localizedCatalog = $this->getMockLocalizedCatalog();
        $localizedCatalog->method('getCatalog')->willReturn(new Catalog());
        $localizedCatalog->method('getId')->willReturn(1);

        $index = new Index('my_product_index');
        $index->setLocalizedCatalog($localizedCatalog);

        $categoryConfigRepository = $this->getMockCategoryConfigurationRepository();
        $categoryConfigRepository->method('findMergedByContext')
            ->willReturn([
                ['id' => 1, 'category_id' => 'one', 'name' => 'One', 'useNameInProductSearch' => 0],
                ['id' => 2, 'category_id' => 'two', 'name' => 'Two (DB name)', 'useNameInProductSearch' => 1],
                ['id' => 5, 'category_id' => 'three', 'name' => 'Three', 'useNameInProductSearch' => 1],
            ]);

        $client = $this->getMockClient();
        $client->method('update')
            ->willReturn(['_shards' => ['failed' => 1]]);

        $logger = $this->getMockLogger();

        $productDataBulk = [
            ['id' => 37, 'name' => 'Product 37', 'category' => [['id' => 'one']]], // No expected update.
            ['id' => 121, 'name' => 'Product 121', 'category' => [['id' => 'one'], ['id' => 'two']]],
            ['id' => 2, 'name' => 'Product 2'], // No expected update.
        ];

        $logger->expects($this->once())->method('error')->with(
            'Error during product update',
            [
                'params' => [
                    'id' => 121,
                    'index' => 'my_product_index',
                    'body' => [
                        'doc' => [
                            'category' => [
                                ['id' => 'one'],
                                ['id' => 'two', 'name' => 'Two (DB name)', '_name' => 'Two (DB name)'],
                            ],
                        ],
                    ],
                    'refresh' => 'wait_for',
                    'timeout' => '500ms',
                ],
                'result' => ['_shards' => ['failed' => 1]],
            ]
        );

        $categoryNameUpdater = new CategoryNameUpdater($categoryConfigRepository, $client, $logger);
        $categoryNameUpdater->updateCategoryNames($index, $productDataBulk);
    }

    private function getMockLocalizedCatalog(): LocalizedCatalog|MockObject
    {
        return $this->getMockBuilder(LocalizedCatalog::class)->getMock();
    }

    private function getMockCategoryConfigurationRepository(): CategoryConfigurationRepository|MockObject
    {
        return $this->getMockBuilder(CategoryConfigurationRepository::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    private function getMockClient(): Client|MockObject
    {
        return $this->getMockBuilder(Client::class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    private function getMockLogger(): LoggerInterface|MockObject
    {
        return $this->getMockBuilder(LoggerInterface::class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}
