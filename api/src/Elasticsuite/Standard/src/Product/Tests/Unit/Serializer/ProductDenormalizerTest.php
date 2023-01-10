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

namespace Elasticsuite\Product\Tests\Unit\Serializer;

use Elasticsuite\Product\Model\Product;
use Elasticsuite\Product\Serializer\ProductDenormalizer;
use Elasticsuite\Search\Model\Document;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductDenormalizerTest extends KernelTestCase
{
    private static ProductDenormalizer $productDenormalizer;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$productDenormalizer = static::getContainer()->get(ProductDenormalizer::class);
    }

    /**
     * @dataProvider denormalizeDataProvider
     *
     * @param mixed   $data    Data to denormalize
     * @param string  $type    Data type
     * @param ?string $format  Data format
     * @param array   $context Denormalization context
     *
     * @throws \Symfony\Component\Serializer\Exception\ExceptionInterface
     */
    public function testDenormalize(
        mixed $data,
        string $type,
        string $format = null,
        array $context = [],
    ): void {
        $denormalizedData = self::$productDenormalizer->denormalize($data, $type, $format, $context);
        $this->assertInstanceOf(Product::class, $denormalizedData);
    }

    public function denormalizeDataProvider(): array
    {
        $documentData = [
            '_index' => 'elasticsuite_com_fr_product_20220603_095414',
            '_type' => '_doc',
            '_id' => '1',
            '_score' => 1.0,
            '_source' => [
                'id' => '1',
                'entity_id' => '1',
                'sku' => '24-MB01',
                'name' => 'Sac de sport Jout',
                'size' => 12,
                'price' => [
                    [
                        'group_id' => 0,
                        'original_price' => 11.99,
                        'price' => 10.99,
                        'is_discounted' => true,
                    ],
                    [
                        'group_id' => 1,
                        'original_price' => 11.99,
                        'price' => 10.99,
                        'is_discounted' => true,
                    ],
                ],
                'stock' => [
                    'status' => 0,
                    'qty' => 0,
                ],
            ],
            'sort' => [1, 1.0],
        ];

        return [
            [
                $documentData,
                'Elasticsuite\Product\Model\Product',
                'elasticsearch',
                [],
            ],
            [
                new Product($documentData),
                'Elasticsuite\Product\Model\Product',
                'elasticsearch',
                [],
            ],
            [
                new Document($documentData),
                'Elasticsuite\Product\Model\Product',
                'elasticsearch',
                [],
            ],
        ];
    }
}
