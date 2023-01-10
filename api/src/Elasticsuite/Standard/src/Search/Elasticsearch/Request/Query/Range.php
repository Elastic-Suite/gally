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
 * ElasticSuite range query implementation.
 */
class Range implements QueryInterface
{
    private float $boost;

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
     * @param float   $boost  Query boost
     */
    public function __construct(
        string $field,
        array $bounds = [],
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
        $this->field = $field;
        $this->bounds = $bounds;
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
