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

namespace Gally\Search\Tests\Unit\Elasticsearch\Builder\Request\Query;

use Gally\Search\Elasticsearch\Builder\Request\Query\Filter\FilterQueryBuilder;
use Gally\Search\Elasticsearch\Builder\Request\Query\Fulltext\FulltextQueryBuilder;
use Gally\Search\Elasticsearch\Builder\Request\Query\QueryBuilder;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Elasticsearch\Request\Query\Filtered;
use Gally\Search\Elasticsearch\Request\QueryFactory;
use Gally\Search\Elasticsearch\Request\QueryInterface;
use Gally\Search\Elasticsearch\SpellcheckerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Search request query builder test case.
 */
class QueryBuilderTest extends KernelTestCase
{
    /**
     * Test creating a query from a fulltext search and filters.
     */
    public function testCreateQuery(): void
    {
        $builder = new QueryBuilder(
            $this->getQueryFactory(),
            $this->getFulltextQueryBuilder(),
            $this->getFilterQueryBuilder(),
            /*$this->getSearchContext()*/
        );

        $query = $builder->createQuery(
            $this->getContainerConfiguration(),
            'test',
            ['filter'],
            SpellcheckerInterface::SPELLING_TYPE_EXACT
        );

        $this->assertInstanceOf(QueryInterface::class, $query);
        $this->assertEquals(QueryInterface::TYPE_FILTER, $query->getType());

        /** @var Filtered $query */
        $this->assertInstanceOf(QueryInterface::class, $query->getQuery());
        $this->assertEquals('fulltextQuery', $query->getQuery()->getType());

        $this->assertInstanceOf(QueryInterface::class, $query->getFilter());
        $this->assertEquals('filterQuery', $query->getFilter()->getType());
    }

    /*
     * Mocks the search context.
     */
    /*
    private function getSearchContext(): MockObject
    {
        return $this->getMockBuilder(ContextInterface::class)->getMock();
    }
    */

    /*
     * Mocks the container configuration.
     */
    private function getContainerConfiguration(): ContainerConfigurationInterface|MockObject
    {
        $containerConfiguration = $this->getMockBuilder(ContainerConfigurationInterface::class)->getMock();

        $containerConfiguration->method('getFilters')->willReturn([]);

        return $containerConfiguration;
    }

    /**
     * Get the query factory used by the tested builder.
     */
    private function getQueryFactory(): QueryFactory
    {
        return static::getContainer()->get(QueryFactory::class);
    }

    /*
     * Mocks the fulltext query builder.
     */
    private function getFulltextQueryBuilder(): FulltextQueryBuilder|MockObject
    {
        return $this->getQueryBuilder(FulltextQueryBuilder::class, 'fulltextQuery');
    }

    /*
     * Mocks the filters query builder.
     */
    private function getFilterQueryBuilder(): FilterQueryBuilder|MockObject
    {
        return $this->getQueryBuilder(FilterQueryBuilder::class, 'filterQuery');
    }

    /*
     * Mock a query builder that creates query with the indicated type.
     *
     * @param string $class mocked class name
     * @param string $name  mock returned query type
     */
    private function getQueryBuilder(string $class, string $name): MockObject
    {
        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $query->method('getType')->willReturn($name);

        $queryBuilder = $this->getMockBuilder($class)->disableOriginalConstructor()->getMock();
        $queryBuilder->method('create')->willReturn($query);

        return $queryBuilder;
    }
}
