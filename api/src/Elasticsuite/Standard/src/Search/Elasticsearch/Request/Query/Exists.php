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
 * Exists field definition implementation.
 */
class Exists implements QueryInterface
{
    private ?string $name;

    private string $field;

    private float $boost;

    /**
     * Constructor.
     *
     * @param string  $field Query field
     * @param ?string $name  Query name
     * @param float   $boost Query boost
     */
    public function __construct(
        string $field,
        ?string $name = null,
        float $boost = QueryInterface::DEFAULT_BOOST_VALUE
    ) {
        $this->name = $name;
        $this->boost = $boost;
        $this->field = $field;
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
        return QueryInterface::TYPE_EXISTS;
    }

    /**
     * Field whose existence to check.
     */
    public function getField(): string
    {
        return $this->field;
    }
}
