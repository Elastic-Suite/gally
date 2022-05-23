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
