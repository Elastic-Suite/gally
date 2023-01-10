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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;

interface AggregationInterface
{
    /**
     * Get aggregation name.
     */
    public function getName(): string;

    /**
     * Get aggregation field name.
     */
    public function getField(): string;

    /**
     * Get aggregation total document count.
     */
    public function getCount(): ?int;

    /**
     * Get aggregation values.
     */
    public function getValues(): array;
}
