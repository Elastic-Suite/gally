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

namespace Gally\Search\Elasticsearch;

use Gally\Search\Elasticsearch\Request\AggregationInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;

/**
 * Gally search requests interface.
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
     * @return AggregationInterface[]
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
