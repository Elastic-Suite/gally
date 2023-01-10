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

namespace Gally\Search\Elasticsearch\Request\Query;

use Gally\Search\Elasticsearch\Request\QueryInterface;

/**
 * Filtered query definition.
 */
class Filtered implements QueryInterface
{
    private ?string $name;

    private float $boost;

    private ?QueryInterface $filter;

    private ?QueryInterface $query;

    /**
     * Constructor.
     *
     * @param ?QueryInterface $query  Query part of the filtered query
     * @param ?QueryInterface $filter Filter part of the filtered query
     * @param ?string         $name   Query name
     * @param float           $boost  Query boost
     */
    public function __construct(
        ?QueryInterface $query = null,
        ?QueryInterface $filter = null,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
        $this->filter = $filter;
        $this->query = $query;
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
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_FILTER;
    }

    /**
     * Query part of the filtered query.
     */
    public function getQuery(): ?QueryInterface
    {
        return $this->query;
    }

    /**
     * Filter part of the filtered query.
     */
    public function getFilter(): ?QueryInterface
    {
        return $this->filter;
    }
}
