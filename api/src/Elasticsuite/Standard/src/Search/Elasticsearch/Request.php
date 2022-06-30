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

use Elasticsuite\Index\Helper\IndexSettings;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;
use Elasticsuite\Search\Elasticsearch\Request\SortOrderInterface;

class Request implements RequestInterface
{
    protected string $name;

    protected string $index;

    protected QueryInterface $query;

    private array $sortOrders;

    private ?int $from;

    private ?int $size;

    private array $aggregations;

    private ?QueryInterface $filter;

    private int $spellingType = SpellcheckerInterface::SPELLING_TYPE_EXACT;

    private bool|int $trackTotalHits = IndexSettings::PER_SHARD_MAX_RESULT_WINDOW;

    /**
     * Constructor.
     *
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     *
     * @param string                 $name           Search request name
     * @param string                 $indexName      Index name
     * @param QueryInterface         $query          Search query
     * @param ?QueryInterface        $filter         Search filter
     * @param SortOrderInterface[]   $sortOrders     Sort orders specification
     * @param int|null               $from           Pagination from clause
     * @param int|null               $size           Pagination page size clause
     * @param AggregationInterface[] $aggregations   Search request aggregations definition
     * @param int|null               $spellingType   For fulltext query : the type of spellchecked applied
     * @param bool|int|null          $trackTotalHits Value of the 'track_total_hits' ES parameter
     */
    public function __construct(
        string $name,
        string $indexName,
        QueryInterface $query,
        ?QueryInterface $filter = null,
        array $sortOrders = null,
        ?int $from = null,
        ?int $size = null,
        array $aggregations = [],
        int $spellingType = null,
        bool|int $trackTotalHits = null,
    ) {
        $this->name = $name;
        $this->index = $indexName;
        $this->query = $query;
        $this->filter = $filter;
        $this->sortOrders = $sortOrders ?? [];
        $this->from = $from;
        $this->size = $size;
        $this->aggregations = $aggregations;

        if (null !== $spellingType) {
            $this->spellingType = $spellingType;
        }

        if (null !== $trackTotalHits) {
            $this->trackTotalHits = $this->parseTrackTotalHits($trackTotalHits);
        }
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getIndex(): string
    {
        return $this->index;
    }

    /**
     * {@inheritDoc}
     */
    public function getAggregations(): array
    {
        return $this->aggregations;
    }

    /**
     * {@inheritDoc}
     */
    public function getQuery(): QueryInterface
    {
        return $this->query;
    }

    /**
     * {@inheritDoc}
     */
    public function getFrom(): int|null
    {
        return $this->from;
    }

    /**
     * {@inheritDoc}
     */
    public function getSize(): int|null
    {
        return $this->size;
    }

    /**
     * {@inheritDoc}
     */
    public function getFilter(): ?QueryInterface
    {
        return $this->filter;
    }

    /**
     * {@inheritDoc}
     */
    public function getSortOrders(): array
    {
        return $this->sortOrders;
    }

    /**
     * {@inheritDoc}
     */
    public function getTrackTotalHits(): int|bool
    {
        return $this->trackTotalHits;
    }

    /**
     * {@inheritDoc}
     */
    public function isSpellchecked(): bool
    {
        $fuzzySpellingTypes = [
            SpellcheckerInterface::SPELLING_TYPE_FUZZY,
            SpellcheckerInterface::SPELLING_TYPE_MOST_FUZZY,
        ];

        return \in_array($this->spellingType, $fuzzySpellingTypes, true);
    }

    /**
     * Parse the track_total_hits directive to appropriate type : either int or bool.
     * It's actually passed as a string when coming from the configuration file reader.
     *
     * @param int|bool|string $trackTotalHits The track_total_hits value
     */
    private function parseTrackTotalHits($trackTotalHits): int|bool
    {
        $trackTotalHits = is_numeric($trackTotalHits) ? (int) $trackTotalHits : filter_var($trackTotalHits, \FILTER_VALIDATE_BOOLEAN, \FILTER_NULL_ON_FAILURE);

        if (false === $trackTotalHits || null === $trackTotalHits) {
            $trackTotalHits = 0;
        }

        return $trackTotalHits;
    }
}
