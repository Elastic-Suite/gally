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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler;

/**
 * Complex assemblers are able to use the global assembler to assemble sub-queries.
 */
abstract class AbstractComplexAssembler
{
    protected Assembler $parentAssembler;

    /**
     * Constructor.
     *
     * @param Assembler $assembler Parent assembler used to assemble sub-queries
     */
    public function __construct(Assembler $assembler)
    {
        $this->parentAssembler = $assembler;
    }
}
