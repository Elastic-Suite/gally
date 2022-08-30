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

namespace Elasticsuite\Index\Tests\Unit\Converter\SourceField;

use Elasticsuite\Index\Converter\SourceField\BasicSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\ImageSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\PriceSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\ReferenceSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\SelectSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\SourceFieldConverterInterface;
use Elasticsuite\Index\Converter\SourceField\StockSourceFieldConverter;
use Elasticsuite\Index\Converter\SourceField\TextSourceFieldConverter;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Standard\src\Test\AbstractTest;
use PHPUnit\Framework\MockObject\MockObject;

class SourceFieldConverterTest extends AbstractTest
{
    /** @var SourceFieldConverterInterface[] */
    private static array $sourceFieldConverters;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$sourceFieldConverters = [
            BasicSourceFieldConverter::class => static::getContainer()->get(BasicSourceFieldConverter::class),
            ImageSourceFieldConverter::class => static::getContainer()->get(ImageSourceFieldConverter::class),
            PriceSourceFieldConverter::class => static::getContainer()->get(PriceSourceFieldConverter::class),
            ReferenceSourceFieldConverter::class => static::getContainer()->get(ReferenceSourceFieldConverter::class),
            SelectSourceFieldConverter::class => static::getContainer()->get(SelectSourceFieldConverter::class),
            StockSourceFieldConverter::class => static::getContainer()->get(StockSourceFieldConverter::class),
            TextSourceFieldConverter::class => static::getContainer()->get(TextSourceFieldConverter::class),
        ];
    }

    /**
     * @dataProvider supportsDataProvider
     */
    public function testSupports(string $sourceFieldConverter, string $sourceFieldType, bool $expectedReturns): void
    {
        $this->assertArrayHasKey($sourceFieldConverter, self::$sourceFieldConverters);

        $this->assertEquals(
            $expectedReturns,
            self::$sourceFieldConverters[$sourceFieldConverter]->supports($this->getMockSourceField($sourceFieldType))
        );
    }

    public function supportsDataProvider(): array
    {
        return [
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, true],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_INT, true],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, true],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, true],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [BasicSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, true],
            [ImageSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, true],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [PriceSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, true],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [ReferenceSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, true],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [SelectSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [StockSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, true],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [StockSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],

            [TextSourceFieldConverter::class, SourceField\Type::TYPE_TEXT, true],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_KEYWORD, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_SELECT, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_INT, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_BOOLEAN, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_FLOAT, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_PRICE, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_STOCK, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_REFERENCE, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_IMAGE, false],
            [TextSourceFieldConverter::class, SourceField\Type::TYPE_OBJECT, false],
        ];
    }

    private function getMockSourceField(string $sourceFieldType): SourceField|MockObject
    {
        $mockSourceField = $this->getMockBuilder(SourceField::class)
            ->disableOriginalConstructor()
            ->getMock();

        $mockSourceField->method('getType')->willReturn($sourceFieldType);

        return $mockSourceField;
    }
}
