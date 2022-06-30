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
