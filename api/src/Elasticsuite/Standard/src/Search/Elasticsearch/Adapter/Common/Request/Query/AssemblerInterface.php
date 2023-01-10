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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Assemble Elasticsearch queries from search request QueryInterface queries.
 */
interface AssemblerInterface
{
    /**
     * Assemble the concrete Elasticsearch query from a Query object.
     *
     * @param QueryInterface $query Query to be assembled
     */
    public function assembleQuery(QueryInterface $query): array;
}
