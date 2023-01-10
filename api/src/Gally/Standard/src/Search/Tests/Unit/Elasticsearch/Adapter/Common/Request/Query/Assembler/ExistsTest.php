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

namespace Gally\Search\Tests\Unit\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler\Exists as ExistsQueryAssembler;
use Gally\Search\Elasticsearch\Request\Query\Exists as ExistsQuery;

/**
 * Exists search request query test case.
 */
class ExistsTest extends AbstractSimpleQueryAssemblerTest
{
    /**
     * Test the assembler with mandatory params only.
     */
    public function testAnonymousMissingQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $missingQuery = new ExistsQuery('field');
        $query = $assembler->assembleQuery($missingQuery);

        $this->assertArrayHasKey('exists', $query);
        $this->assertArrayHasKey('field', $query['exists']);
        $this->assertArrayNotHasKey('_name', $query['exists']);
    }

    /**
     * Test the assembler with mandatory + name params.
     */
    public function testNamedMissingQueryAssembler(): void
    {
        $assembler = $this->getQueryAssembler();

        $missingQuery = new ExistsQuery('field', 'queryName');
        $query = $assembler->assembleQuery($missingQuery);

        $this->assertArrayHasKey('_name', $query['exists']);
        $this->assertEquals('queryName', $query['exists']['_name']);
    }

    /**
     * {@inheritDoc}
     */
    protected function getQueryAssembler(): ExistsQueryAssembler
    {
        return new ExistsQueryAssembler();
    }
}
