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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler as QueryAssembler;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Common methods used to test query composed assemblers (bool, not, ...).
 */
abstract class AbstractComplexQueryAssemblerTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Return a mocked parent query assembler used to assemble sub-queries.
     */
    protected function getParentQueryAssembler(): QueryAssembler
    {
        $mock = $this->getMockBuilder(QueryAssembler::class)
            ->disableOriginalConstructor()
            ->getMock();

        $assembleQueryCallback = function (QueryInterface $query) {
            return [$query->getName()];
        };

        $mock->method('assembleQuery')->willReturnCallback($assembleQueryCallback);

        return $mock;
    }

    /**
     * Mock a sub query.
     *
     * @param string $queryName Query name
     */
    protected function getSubQueryMock(string $queryName): QueryInterface
    {
        $mock = $this->getMockBuilder(QueryInterface::class)->getMock();
        $mock->method('getName')->willReturn($queryName);

        return $mock;
    }
}
