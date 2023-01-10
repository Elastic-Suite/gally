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

namespace Gally\Product\Tests\Unit\GraphQl\Type\Definition\Filter;

use Gally\Entity\GraphQl\Type\Definition\Filter\PriceTypeDefaultFilterInputType;
use Gally\Entity\Service\PriceGroupProvider;
use Gally\Search\Constant\FilterOperator;
use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Service\ReverseSourceFieldProvider;
use GraphQL\Type\Definition\Type;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class PriceTypeDefaultFilterInputTypeTest extends KernelTestCase
{
    private static FilterQueryBuilder $filterQueryBuilder;

    private static QueryFactory $queryFactory;

    private static PriceGroupProvider $priceGroupProvider;

    private static ReverseSourceFieldProvider $reverseSourceFieldProvider;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();
        self::$filterQueryBuilder = static::getContainer()->get(FilterQueryBuilder::class);
        self::$queryFactory = static::getContainer()->get(QueryFactory::class);
        self::$priceGroupProvider = static::getContainer()->get(PriceGroupProvider::class);
        self::$reverseSourceFieldProvider = static::getContainer()->get(ReverseSourceFieldProvider::class);
    }

    public function testInstantiate(): void
    {
        $reflector = new \ReflectionClass(PriceTypeDefaultFilterInputType::class);

        $nestingSeparatorProperty = $reflector->getProperty('nestingSeparator');
        $nameProperty = $reflector->getProperty('name');
        $configProperty = $reflector->getProperty('config');

        $priceTypeDefaultFilterInputType = new PriceTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            self::$priceGroupProvider,
            self::$reverseSourceFieldProvider,
            '##'
        );

        $this->assertEquals(
            [
                'fields' => [
                    FilterOperator::EQ => Type::float(),
                    FilterOperator::IN => Type::listOf(Type::float()),
                    FilterOperator::GTE => Type::float(),
                    FilterOperator::GT => Type::float(),
                    FilterOperator::LT => Type::float(),
                    FilterOperator::LTE => Type::float(),
                ],
            ],
            $priceTypeDefaultFilterInputType->getConfig()
        );

        $this->assertEquals('##', $nestingSeparatorProperty->getValue($priceTypeDefaultFilterInputType));

        $this->assertEquals(
            PriceTypeDefaultFilterInputType::SPECIFIC_NAME,
            $nameProperty->getValue($priceTypeDefaultFilterInputType)
        );
        $this->assertEquals(
            PriceTypeDefaultFilterInputType::SPECIFIC_NAME,
            $priceTypeDefaultFilterInputType->getName()
        );
        $this->assertEquals(
            array_merge(
                ['name' => PriceTypeDefaultFilterInputType::SPECIFIC_NAME],
                $priceTypeDefaultFilterInputType->getConfig()
            ),
            $configProperty->getValue($priceTypeDefaultFilterInputType)
        );
    }

    public function testFieldNames(): void
    {
        $priceTypeDefaultFilterInputType = new PriceTypeDefaultFilterInputType(
            self::$filterQueryBuilder,
            self::$queryFactory,
            self::$priceGroupProvider,
            self::$reverseSourceFieldProvider,
            '##'
        );

        $this->assertEquals('my_price.price', $priceTypeDefaultFilterInputType->getFilterFieldName('my_price'));
        $this->assertEquals('my_price##price', $priceTypeDefaultFilterInputType->getGraphQlFieldName('my_price.price'));
        $this->assertEquals('my_price.price', $priceTypeDefaultFilterInputType->getMappingFieldName('my_price##price'));
    }
}
