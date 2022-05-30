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

interface BucketValueInterface
{
    /**
     * Get bucket value key.
     */
    public function getKey(): mixed;

    /**
     * Get count of documents that match this bucket.
     */
    public function getCount(): int;

    /**
     * Get child aggregation of this bucket.
     */
    public function getChildAggregation(): iterable;
}
