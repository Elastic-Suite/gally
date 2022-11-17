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
 * ElasticSuite request term query.
 */
class Term implements QueryInterface
{
    private ?string $name;

    private float $boost;

    private string|bool|int|float $value;

    private string $field;

    /**
     * The term query produce an Elasticsearch term query.
     *
     * @param string|bool $value Search value
     * @param string      $field Search field
     * @param ?string     $name  Name of the query
     * @param float       $boost Query boost
     */
    public function __construct(
        string|bool|int|float $value,
        string $field,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->value = $value;
        $this->field = $field;
        $this->boost = $boost;
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
        return QueryInterface::TYPE_TERM;
    }

    /**
     * Search value.
     */
    public function getValue(): string|bool|int|float
    {
        return $this->value;
    }

    /**
     * Search field.
     */
    public function getField(): string
    {
        return $this->field;
    }
}
