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

namespace Elasticsuite\Search\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * bool queries request implementation.
 */
class Boolean implements QueryInterface
{
    private ?string $name;

    private float $boost;

    /**
     * @var QueryInterface[]
     */
    private array $must;

    /**
     * @var QueryInterface[]
     */
    private array $should;

    /**
     * @var QueryInterface[]
     */
    private array $mustNot;

    private int $minimumShouldMatch;

    private bool $cached;

    /**
     * Constructor.
     *
     * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
     *
     * @param QueryInterface[] $must               Must clause queries
     * @param QueryInterface[] $should             Should clause queries
     * @param QueryInterface[] $mustNot            Must not clause queries
     * @param int              $minimumShouldMatch Minimum should match query clause
     * @param ?string          $name               Query name
     * @param float            $boost              Query boost
     * @param bool             $cached             Should the query be cached or not
     */
    public function __construct(
        array $must = [],
        array $should = [],
        array $mustNot = [],
        int $minimumShouldMatch = 1,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE,
        bool $cached = false
    ) {
        $this->must = $must;
        $this->should = $should;
        $this->mustNot = $mustNot;
        $this->boost = $boost;
        $this->name = $name;
        $this->minimumShouldMatch = $minimumShouldMatch;
        $this->cached = $cached;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_BOOL;
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * {@inheritDoc}
     */
    public function getBoost(): float
    {
        return $this->boost;
    }

    /**
     * Must clause queries.
     *
     * @return QueryInterface[]
     */
    public function getMust(): array
    {
        return $this->must;
    }

    /**
     * Should clause queries.
     *
     * @return QueryInterface[]
     */
    public function getShould(): array
    {
        return $this->should;
    }

    /**
     * Must not clause queries.
     *
     * @return QueryInterface[]
     */
    public function getMustNot(): array
    {
        return $this->mustNot;
    }

    /**
     * Minimum should match query clause.
     */
    public function getMinimumShouldMatch(): int
    {
        return $this->minimumShouldMatch;
    }

    /**
     * Indicates if the bool query needs to be cached or not.
     */
    public function isCached(): bool
    {
        return $this->cached;
    }
}
