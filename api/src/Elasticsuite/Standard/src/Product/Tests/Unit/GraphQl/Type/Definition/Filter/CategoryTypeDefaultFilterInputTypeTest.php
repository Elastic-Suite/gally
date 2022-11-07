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

namespace Elasticsuite\Product\Tests\Unit\GraphQl\Type\Definition\Filter;

use Elasticsuite\Product\GraphQl\Type\Definition\Filter\CategoryTypeDefaultFilterInputType;
use Elasticsuite\Search\Constant\FilterOperator;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use GraphQL\Type\Definition\Type;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class CategoryTypeDefaultFilterInputTypeTest extends KernelTestCase
{
    private static FilterQueryBuilder $filterQueryBuilder;

    private static QueryFactory $queryFactory;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$filterQueryBuilder = static::getContainer()->get(FilterQueryBuilder::class);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
    }

    public function testInstantiate(): void
    {
        $reflector = new \ReflectionClass(CategoryTypeDefaultFilterInputType::class);

        $nestingSeparatorProperty = $reflector->getProperty('nestingSeparator');
        $nameProperty = $reflector->getProperty('name');
        $configProperty = $reflector->getProperty('config');

        $categoryTypeDefaultFilterInputType = new CategoryTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '##'
        );

        $this->assertEquals(
            [
                'fields' => [
                    FilterOperator::EQ => Type::nonNull(Type::string()),
                ],
            ],
            $categoryTypeDefaultFilterInputType->getConfig()
        );

        $this->assertEquals('##', $nestingSeparatorProperty->getValue($categoryTypeDefaultFilterInputType));

        $this->assertEquals(
            CategoryTypeDefaultFilterInputType::SPECIFIC_NAME,
            $nameProperty->getValue($categoryTypeDefaultFilterInputType)
        );
        $this->assertEquals(
            CategoryTypeDefaultFilterInputType::SPECIFIC_NAME,
            $categoryTypeDefaultFilterInputType->getName()
        );
        $this->assertEquals(
            array_merge(
                ['name' => CategoryTypeDefaultFilterInputType::SPECIFIC_NAME],
                $categoryTypeDefaultFilterInputType->getConfig()
            ),
            $configProperty->getValue($categoryTypeDefaultFilterInputType)
        );
    }

    public function testFieldNames(): void
    {
        $categoryTypeDefaultFilterInputType = new CategoryTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '##'
        );

        $this->assertEquals('my_category##id', $categoryTypeDefaultFilterInputType->getGraphQlFieldName('my_category'));
        $this->assertEquals('my_category.id', $categoryTypeDefaultFilterInputType->getMappingFieldName('my_category##id'));
    }

    /**
     * @dataProvider validateDataProvider
     *
     * @param string $fieldName      Field name
     * @param array  $inputData      Input data
     * @param array  $expectedErrors Array of expected error messages (empty if no errors expected)
     */
    public function testValidate(string $fieldName, array $inputData, array $expectedErrors): void
    {
        $categoryTypeDefaultFilterInputType = new CategoryTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '__'
        );

        $errors = $categoryTypeDefaultFilterInputType->validate($fieldName, $inputData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function validateDataProvider(): array
    {
        return [
            ['category__id', ['eq' => 'cat_1'], []],
        ];
    }
}
