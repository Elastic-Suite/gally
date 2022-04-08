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

namespace Elasticsuite\Search\Elasticsearch\Request\Query;

use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Query negation definition implementation.
 */
class Not implements QueryInterface
{
    private ?string $name;

    private int $boost;

    private ?QueryInterface $query;

    /**
     * Constructor.
     *
     * @param ?QueryInterface $query Negated query
     * @param ?string         $name  Query name
     * @param int             $boost Query boost
     */
    public function __construct(
        ?QueryInterface $query = null,
        ?string $name = null,
        int $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
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
    public function getBoost(): int
    {
        return $this->boost;
    }

    /**
     * {@inheritDoc}
     */
    public function getType(): string
    {
        return QueryInterface::TYPE_NOT;
    }

    /**
     * Negated query.
     */
    public function getQuery(): ?QueryInterface
    {
        return $this->query;
    }
}
