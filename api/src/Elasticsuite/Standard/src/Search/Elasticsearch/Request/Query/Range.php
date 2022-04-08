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
 * ElasticSuite range query implementation.
 */
class Range implements QueryInterface
{
    private int $boost;

    private ?string $name;

    private string $field;

    private array $bounds;

    // TODO use ArrayForm ?
    /**
     * Constructor.
     *
     * @param string  $field  Query field
     * @param array   $bounds Range filter bounds (authorized entries : gt, lt, lte, gte)
     * @param ?string $name   Query name
     * @param int     $boost  Query boost
     */
    public function __construct(
        string $field,
        array $bounds = [],
        ?string $name = null,
        int $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
        $this->field = $field;
        $this->bounds = $bounds;
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
        return QueryInterface::TYPE_RANGE;
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * Query field.
     */
    public function getField(): string
    {
        return $this->field;
    }

    /**
     * Range filter bounds.
     */
    public function getBounds(): array
    {
        return $this->bounds;
    }
}
