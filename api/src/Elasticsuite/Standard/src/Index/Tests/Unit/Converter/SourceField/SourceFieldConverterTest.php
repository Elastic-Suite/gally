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
use Elasticsuite\Index\Model\Index\Mapping;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Test\AbstractTest;
use PHPUnit\Framework\MockObject\MockObject;

class SourceFieldConverterTest extends AbstractTest
{
    /** @var SourceFieldConverterInterface[] */
    private static array $sourceFieldConverters;

    private static array $sourceFieldConfigs = [];

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

    /**
     * @dataProvider basicSourceFieldConversionDataProvider
     */
    public function testBasicSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        string $expectedFieldCode,
        string $expectedFieldType,
        ?string $expectedNestedPath,
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[BasicSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(1, $mappingFields);
            $this->assertArrayHasKey($expectedFieldCode, $mappingFields);
            $mappingField = $mappingFields[$expectedFieldCode];
            $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

            $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedFieldCode);
            $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedFieldType);
            $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedNestedPath);

            $fieldConfig = $fieldConfigProperty->getValue($mappingField);
            $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
            $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
            $this->assertEquals(
                $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                $fieldConfig['is_filterable']
            );
            $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
            $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);
        }
    }

    public function basicSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'keywordField',
                SourceField\Type::TYPE_KEYWORD,
                'keywordField',
                Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                null,
            ],
            [
                'integerField',
                SourceField\Type::TYPE_INT,
                'integerField',
                Mapping\FieldInterface::FIELD_TYPE_INTEGER,
                null,
            ],
            [
                'booleanField',
                SourceField\Type::TYPE_BOOLEAN,
                'booleanField',
                Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                null,
            ],
            [
                'doubleField',
                SourceField\Type::TYPE_FLOAT,
                'doubleField',
                Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                null,
            ],
            [
                'some.keywordField',
                SourceField\Type::TYPE_KEYWORD,
                'some.keywordField',
                Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                'some',
            ],
            [
                'another.integerField',
                SourceField\Type::TYPE_INT,
                'another.integerField',
                Mapping\FieldInterface::FIELD_TYPE_INTEGER,
                'another',
            ],
            [
                'deep.booleanField',
                SourceField\Type::TYPE_BOOLEAN,
                'deep.booleanField',
                Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                'deep',
            ],
            [
                'deeper.doubleField',
                SourceField\Type::TYPE_FLOAT,
                'deeper.doubleField',
                Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                'deeper',
            ],
        ];
    }

    /**
     * @dataProvider imageSourceFieldConversionDataProvider
     */
    public function testImageSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        string $expectedFieldCode,
        string $expectedFieldType,
        ?string $expectedNestedPath,
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[ImageSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(1, $mappingFields);
            $this->assertArrayHasKey($expectedFieldCode, $mappingFields);
            $mappingField = $mappingFields[$expectedFieldCode];
            $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

            $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedFieldCode);
            $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedFieldType);
            $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedNestedPath);

            $fieldConfig = $fieldConfigProperty->getValue($mappingField);
            // $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
            $this->assertFalse($fieldConfig['is_searchable']);
            $this->assertFalse($fieldConfig['is_used_in_spellcheck']);
            $this->assertEquals($sourceFieldProperties['isFilterable']->getValue($sourceField), $fieldConfig['is_filterable']);
            $this->assertFalse($fieldConfig['is_used_for_sort_by']);
            $this->assertEquals(1, $fieldConfig['search_weight']);
        }
    }

    public function imageSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'imageField',
                SourceField\Type::TYPE_IMAGE,
                'imageField',
                Mapping\FieldInterface::FIELD_TYPE_TEXT,
                null,
            ],
            [
                'some.imageField',
                SourceField\Type::TYPE_IMAGE,
                'some.imageField',
                Mapping\FieldInterface::FIELD_TYPE_TEXT,
                'some',
            ],
        ];
    }

    /**
     * @dataProvider priceSourceFieldConversionDataProvider
     */
    public function testPriceSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        array $expectedFields
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[PriceSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(\count($expectedFields), $mappingFields);

            foreach ($expectedFields as $expectedField) {
                $this->assertArrayHasKey($expectedField['code'], $mappingFields);
                $mappingField = $mappingFields[$expectedField['code']];
                $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

                $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedField['code']);
                $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedField['type']);
                $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedField['path']);

                $fieldConfig = $fieldConfigProperty->getValue($mappingField);
                $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
                $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
                $this->assertEquals(
                    $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                    $fieldConfig['is_filterable']
                );
                $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
                $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);
            }
        }
    }

    public function priceSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'priceField',
                SourceField\Type::TYPE_PRICE,
                [
                    [
                        'code' => 'priceField.original_price',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'priceField',
                    ],
                    [
                        'code' => 'priceField.price',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'priceField',
                    ],
                    [
                        'code' => 'priceField.is_discounted',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                        'path' => 'priceField',
                    ],
                    [
                        'code' => 'priceField.group_id',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                        'path' => 'priceField',
                    ],
                ],
            ],
            [
                'deep.priceField',
                SourceField\Type::TYPE_PRICE,
                [
                    [
                        'code' => 'deep.priceField.original_price',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'deep.priceField',
                    ],
                    [
                        'code' => 'deep.priceField.price',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'deep.priceField',
                    ],
                    [
                        'code' => 'deep.priceField.is_discounted',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                        'path' => 'deep.priceField',
                    ],
                    [
                        'code' => 'deep.priceField.group_id',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                        'path' => 'deep.priceField',
                    ],
                ],
            ],
        ];
    }

    /**
     * @dataProvider referenceSourceFieldConversionDataProvider
     */
    public function testReferenceSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        array $expectedFields
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[ReferenceSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(\count($expectedFields), $mappingFields);

            foreach ($expectedFields as $expectedField) {
                $this->assertArrayHasKey($expectedField['code'], $mappingFields);
                $mappingField = $mappingFields[$expectedField['code']];
                $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

                $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedField['code']);
                $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedField['type']);
                $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedField['path']);

                $fieldConfig = $fieldConfigProperty->getValue($mappingField);
                $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
                $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
                $this->assertEquals(
                    $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                    $fieldConfig['is_filterable']
                );
                $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
                $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);

                $this->assertEquals('reference', $fieldConfig['default_search_analyzer']);
            }
        }
    }

    public function referenceSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'referenceField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'referenceField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => null,
                    ],
                    [
                        'code' => 'children.referenceField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => null,
                    ],
                ],
            ],
            [
                'nested.referenceField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'nested.referenceField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => 'nested',
                    ],
                ],
            ],
        ];
    }

    /**
     * @dataProvider selectSourceFieldConversionDataProvider
     */
    public function testSelectSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        array $expectedFields
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[SelectSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(\count($expectedFields), $mappingFields);

            foreach ($expectedFields as $expectedField) {
                $this->assertArrayHasKey($expectedField['code'], $mappingFields);
                $mappingField = $mappingFields[$expectedField['code']];
                $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

                $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedField['code']);
                $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedField['type']);
                $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedField['path']);

                $fieldConfig = $fieldConfigProperty->getValue($mappingField);
                $this->assertArrayHasKey('config', $expectedField);
                if ('auto' === $expectedField['config']) {
                    // Means the field config will be based on the sourceField's one.
                    $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
                    $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
                    $this->assertEquals(
                        $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                        $fieldConfig['is_filterable']
                    );
                    $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
                    $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);
                } elseif (\is_array($expectedField['config'])) {
                    foreach ($expectedField['config'] as $fieldConfigPropertyName => $fieldConfigPropertyValue) {
                        $this->assertEquals($fieldConfigPropertyValue, $fieldConfig[$fieldConfigPropertyName]);
                    }
                } else {
                    $this->fail('Invalid mapping field config');
                }
            }
        }
    }

    public function selectSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'selectField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'selectField.value',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                        'path' => 'selectField',
                        // No config, so field config will be the default one.
                        'config' => [
                            'is_searchable' => false,
                            'is_filterable' => true,
                            'is_used_for_sort_by' => false,
                            'is_used_in_spellcheck' => false,
                            'search_weight' => 1,
                        ],
                    ],
                    [
                        'code' => 'selectField.label',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => 'selectField',
                        // Means the field config will be based on the sourceField's one.
                        'config' => 'auto',
                    ],
                ],
            ],
            [
                'nested.selectField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'nested.selectField.value',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_KEYWORD,
                        'path' => 'nested.selectField',
                        // No config, so field config will be the default one.
                        'config' => [
                            'is_searchable' => false,
                            'is_filterable' => true,
                            'is_used_for_sort_by' => false,
                            'is_used_in_spellcheck' => false,
                            'search_weight' => 1,
                        ],
                    ],
                    [
                        'code' => 'nested.selectField.label',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => 'nested.selectField',
                        // Means the field config will be based on the sourceField's one.
                        'config' => 'auto',
                    ],
                ],
            ],
        ];
    }

    /**
     * @dataProvider stockSourceFieldConversionDataProvider
     */
    public function testStockSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        array $expectedFields
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[StockSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(\count($expectedFields), $mappingFields);

            foreach ($expectedFields as $expectedField) {
                $this->assertArrayHasKey($expectedField['code'], $mappingFields);
                $mappingField = $mappingFields[$expectedField['code']];
                $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

                $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedField['code']);
                $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedField['type']);
                $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedField['path']);

                $fieldConfig = $fieldConfigProperty->getValue($mappingField);
                $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
                $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
                $this->assertEquals(
                    $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                    $fieldConfig['is_filterable']
                );
                $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
                $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);
            }
        }
    }

    public function stockSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'stockField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'stockField.status',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                        'path' => 'stockField',
                    ],
                    [
                        'code' => 'stockField.qty',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'stockField',
                    ],
                ],
            ],
            [
                'nested.stockField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'nested.stockField.status',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_BOOLEAN,
                        'path' => 'nested.stockField',
                    ],
                    [
                        'code' => 'nested.stockField.qty',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_DOUBLE,
                        'path' => 'nested.stockField',
                    ],
                ],
            ],
        ];
    }

    /**
     * @dataProvider textSourceFieldConversionDataProvider
     */
    public function testTextSourceFieldConversion(
        string $sourceFieldCode,
        string $sourceFieldType,
        array $expectedFields
    ): void {
        // Initialize reflector to be able to check the private properties set in the Mapping\Field constructor.
        $fieldReflector = new \ReflectionClass(Mapping\Field::class);
        $fieldNameProperty = $fieldReflector->getProperty('name');
        $fieldTypeProperty = $fieldReflector->getProperty('type');
        $fieldConfigProperty = $fieldReflector->getProperty('config');
        $fieldNestedPathProperty = $fieldReflector->getProperty('nestedPath');

        $sourceFieldReflector = new \ReflectionClass(SourceField::class);
        $sourceFieldProperties = [
            'isSearchable' => $sourceFieldReflector->getProperty('isSearchable'),
            'isSpellchecked' => $sourceFieldReflector->getProperty('isSpellchecked'),
            'isFilterable' => $sourceFieldReflector->getProperty('isFilterable'),
            'isUsedForRules' => $sourceFieldReflector->getProperty('isUsedForRules'),
            'isSortable' => $sourceFieldReflector->getProperty('isSortable'),
            'weight' => $sourceFieldReflector->getProperty('weight'),
        ];

        $sourceField = new SourceField();
        $sourceField->setCode($sourceFieldCode)
            ->setType($sourceFieldType);

        $sourceFieldConfigs = self::getSourceFieldConfigs();
        foreach ($sourceFieldConfigs as $sourceFieldConfig) {
            // Apply source field configuration.
            foreach ($sourceFieldConfig as $configItem => $configValue) {
                /** @var \ReflectionProperty $sourceFieldProperty */
                $sourceFieldProperty = &$sourceFieldProperties[$configItem];
                $sourceFieldProperty->setValue($sourceField, $configValue);
            }

            $mappingFields = self::$sourceFieldConverters[ReferenceSourceFieldConverter::class]->getFields($sourceField);
            $this->assertIsArray($mappingFields);
            $this->assertCount(\count($expectedFields), $mappingFields);

            foreach ($expectedFields as $expectedField) {
                $this->assertArrayHasKey($expectedField['code'], $mappingFields);
                $mappingField = $mappingFields[$expectedField['code']];
                $this->assertInstanceOf(Mapping\FieldInterface::class, $mappingField);

                $this->assertEquals($fieldNameProperty->getValue($mappingField), $expectedField['code']);
                $this->assertEquals($fieldTypeProperty->getValue($mappingField), $expectedField['type']);
                $this->assertEquals($fieldNestedPathProperty->getValue($mappingField), $expectedField['path']);

                $fieldConfig = $fieldConfigProperty->getValue($mappingField);
                $this->assertEquals($sourceFieldProperties['isSearchable']->getValue($sourceField), $fieldConfig['is_searchable']);
                $this->assertEquals($sourceFieldProperties['isSpellchecked']->getValue($sourceField), $fieldConfig['is_used_in_spellcheck']);
                $this->assertEquals(
                    $sourceFieldProperties['isFilterable']->getValue($sourceField) || $sourceFieldProperties['isUsedForRules']->getValue($sourceField),
                    $fieldConfig['is_filterable']
                );
                $this->assertEquals($sourceFieldProperties['isSortable']->getValue($sourceField), $fieldConfig['is_used_for_sort_by']);
                $this->assertEquals($sourceFieldProperties['weight']->getValue($sourceField), $fieldConfig['search_weight']);
            }
        }
    }

    public function textSourceFieldConversionDataProvider(): array
    {
        return [
            [
                'textField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'textField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => null,
                    ],
                    [
                        'code' => 'children.textField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => null,
                    ],
                ],
            ],
            [
                'nested.textField',
                SourceField\Type::TYPE_REFERENCE,
                [
                    [
                        'code' => 'nested.textField',
                        'type' => Mapping\FieldInterface::FIELD_TYPE_TEXT,
                        'path' => 'nested',
                    ],
                ],
            ],
        ];
    }

    private static function getSourceFieldConfigs(): array
    {
        if ([] === self::$sourceFieldConfigs) {
            $sourceFieldConfigs = [];

            $sourceFieldBooleanConfigs = [
                'isSearchable',
                'isSpellchecked',
                'isFilterable',
                'isUsedForRules',
                'isSortable',
            ];

            $size = 2 ** \count($sourceFieldBooleanConfigs);
            for ($i = 0; $i < $size; ++$i) {
                // Generates the binary representation of the decimal $i (3 becomes "11", 17 becomes "10001").
                $binary = decbin($i);
                // Adds extra 0 at the beginning of the binary representation if needed ("11" becomes "00011", "10001" stays identical).
                $binary = str_pad($binary, \count($sourceFieldBooleanConfigs), '0', \STR_PAD_LEFT);
                /*
                 * Generates an array with 5 values, each one containing one of the binary bit:
                 * - 3, ie 11, ie 00011, becomes [0, 0, 0, 1, 1]
                 * - 17, ie 10001, becomes [1, 0, 0, 0, 1]
                 */
                $configValues = str_split($binary);
                /*
                 * Changes all flag to proper boolean values
                 * - 3, ie [0, 0, 0, 1, 1], becomes [false, false, false, true, true]
                 * - 17, ie [1, 0, 0, 0, 1], becomes [true, false, false, false, true]
                 */
                $configValues = array_map('boolval', $configValues);
                /*
                 * Combine with the values with the variable/property names
                 * - 3 becomes
                 *  [
                 *      'isSearchable' => false,
                 *      'isSpellchecked' => false,
                 *      'isFilterable' => false,
                 *      'isUsedForRules' => true,
                 *      'isSortable' => true,
                 *  ]
                 * - 17 becomes
                 *  [
                 *      'isSearchable' => true,
                 *      'isSpellchecked' => false,
                 *      'isFilterable' => false,
                 *      'isUsedForRules' => false,
                 *      'isSortable' => true,
                 *  ]
                 */
                $configRow = array_combine($sourceFieldBooleanConfigs, $configValues);

                // Duplicate as many times as needed the array while adding an extra varying column.
                for ($j = 1; $j < 11; ++$j) {
                    $configRow['weight'] = $j;

                    // Finally, add the fully composed test data to the stack.
                    $sourceFieldConfigs[] = $configRow;
                }
            }

            self::assertCount($size * 10, $sourceFieldConfigs);

            self::$sourceFieldConfigs = $sourceFieldConfigs;
        }

        return self::$sourceFieldConfigs;
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
