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

namespace Elasticsuite\Search\Elasticsearch;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;

interface ResponseInterface extends \IteratorAggregate, \Countable
{
    /**
     * Returns the total number of documents in the response.
     */
    public function getTotalItems(): int;

    /**
     * Get aggregations.
     *
     * @return AggregationInterface[]
     */
    public function getAggregations(): array;
}
