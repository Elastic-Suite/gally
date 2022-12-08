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

use Elasticsuite\Entity\GraphQl\Type\Definition\Filter\SelectTypeDefaultFilterInputType;
use Elasticsuite\Search\Constant\FilterOperator;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Elasticsuite\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryFactory;
use GraphQL\Type\Definition\Type;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class SelectTypeDefaultFilterInputTypeTest extends KernelTestCase
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
        $reflector = new \ReflectionClass(SelectTypeDefaultFilterInputType::class);

        $nestingSeparatorProperty = $reflector->getProperty('nestingSeparator');
        $nameProperty = $reflector->getProperty('name');
        $configProperty = $reflector->getProperty('config');

        $selectTypeDefaultFilterInputType = new SelectTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '##'
        );

        $this->assertEquals(
            [
                'fields' => [
                    FilterOperator::EQ => Type::string(),
                    FilterOperator::IN => Type::listOf(Type::string()),
                    FilterOperator::EXIST => Type::boolean(),
                ],
            ],
            $selectTypeDefaultFilterInputType->getConfig()
        );

        $this->assertEquals('##', $nestingSeparatorProperty->getValue($selectTypeDefaultFilterInputType));

        $this->assertEquals(
            SelectTypeDefaultFilterInputType::SPECIFIC_NAME,
            $nameProperty->getValue($selectTypeDefaultFilterInputType)
        );
        $this->assertEquals(
            SelectTypeDefaultFilterInputType::SPECIFIC_NAME,
            $selectTypeDefaultFilterInputType->getName()
        );
        $this->assertEquals(
            array_merge(
                ['name' => SelectTypeDefaultFilterInputType::SPECIFIC_NAME],
                $selectTypeDefaultFilterInputType->getConfig()
            ),
            $configProperty->getValue($selectTypeDefaultFilterInputType)
        );
    }

    public function testFieldNames(): void
    {
        $selectTypeDefaultFilterInputType = new SelectTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '##'
        );

        $this->assertEquals('my_select.value', $selectTypeDefaultFilterInputType->getFilterFieldName('my_select'));
        $this->assertEquals('my_select##value', $selectTypeDefaultFilterInputType->getGraphQlFieldName('my_select.value'));
        $this->assertEquals('my_select.value', $selectTypeDefaultFilterInputType->getMappingFieldName('my_select##value'));
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
        $selectTypeDefaultFilterInputType = new SelectTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            '__'
        );

        $errors = $selectTypeDefaultFilterInputType->validate(
            $fieldName,
            $inputData,
            $this->getMockBuilder(ContainerConfigurationInterface::class)->getMock(),
        );
        $this->assertEquals($expectedErrors, $errors);
    }

    public function validateDataProvider(): array
    {
        return [
            ['fashion_color__value', ['eq' => '24'], []],
            ['fashion_color__value', ['in' => ['25', '37']], []],
            ['fashion_color__value', ['exist' => true], []],
            [
                'fashion_color__value',
                ['eq' => '24', 'in' => ['25', '37']],
                ["Filter argument fashion_color__value: Only 'eq', 'in' or 'exist' should be filled."],
            ],
            [
                'fashion_color__value',
                [],
                ["Filter argument fashion_color__value: At least 'eq', 'in' or 'exist' should be filled."],
            ],
        ];
    }
}
