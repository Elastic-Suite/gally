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

namespace Elasticsuite\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

/**
 * Common method used to test query assemblers.
 */
abstract class AbstractSimpleQueryAssemblerTest extends KernelTestCase
{
    /**
     * Test using the query assembler with an invalid query type throws an exception.
     */
    public function testInvalidQuery(): void
    {
        $this->expectExceptionMessage('Query assembler : invalid query type invalid_type');
        $this->expectException(\InvalidArgumentException::class);
        $assembler = $this->getQueryAssembler();

        $query = $this->getMockBuilder(QueryInterface::class)->getMock();
        $query->method('getType')->willReturn('invalid_type');

        $assembler->assembleQuery($query);
    }

    /**
     * Currently tested assembler.
     */
    abstract protected function getQueryAssembler(): AssemblerInterface;
}
