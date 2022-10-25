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

use Elasticsuite\Product\GraphQl\Type\Definition\Filter\SelectTypeDefaultFilterInputType;
use Elasticsuite\Search\Constant\FilterOperator;
use Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
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

        $this->assertEquals('my_select##value', $selectTypeDefaultFilterInputType->getGraphQlFieldName('my_select'));
        $this->assertEquals('my_select.value', $selectTypeDefaultFilterInputType->getMappingFieldName('my_select##value'));
    }
}
