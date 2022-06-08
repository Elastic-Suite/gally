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

namespace Elasticsuite\Search\Elasticsearch;

use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * ElasticSuite search requests interface.
 *
 * Extended request interface to append supporting following features :
 * - hits filtering not applied to aggregations (ElasticSearch root filters)
 * - sort order definition
 * - spellcheck modes
 * - hits tracking modes
 */
interface RequestInterface
{
    /**
     * Get request name.
     */
    public function getName(): string;

    /**
     * Get index name.
     */
    public function getIndex(): string;

    /**
     * Get aggregations.
     *
     * @return BucketInterface[]
     */
    public function getAggregations(): array;

    /**
     * Get main request query.
     */
    public function getQuery(): QueryInterface;

    /**
     * Get from/pagination offset.
     */
    public function getFrom(): int|null;

    /**
     * Get pagination size.
     */
    public function getSize(): int|null;

    /**
     * Hits filter (does not apply to aggregations).
     *
     * Filter are actually using QueryInterface since there is no differences
     * between queries and filters in Elasticsearch 2.x DSL.
     */
    public function getFilter(): ?QueryInterface;

    /**
     * Request sort order specifications.
     */
    public function getSortOrders(): array;

    /**
     * Indicates if the query has been spellchecked.
     */
    public function isSpellchecked(): bool;

    /**
     * Get the value of the track_total_hits parameter, if any.
     */
    public function getTrackTotalHits(): int|bool;
}
