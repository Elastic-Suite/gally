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

namespace Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket;

use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Abstract bucket implementation.
 */
abstract class AbstractBucket implements BucketInterface
{
    private string $name;

    private string $field;

    /**
     * @var AggregationInterface[]
     */
    private array $childAggregations;

    private ?string $nestedPath;

    private ?QueryInterface $filter;

    private ?QueryInterface $nestedFilter;

    /**
     * Constructor.
     *
     * @param string                 $name              Bucket name
     * @param string                 $field             Bucket field
     * @param AggregationInterface[] $childAggregations Child aggregations
     * @param ?string                $nestedPath        Nested path for nested bucket
     * @param ?QueryInterface        $filter            Bucket filter
     * @param ?QueryInterface        $nestedFilter      Nested filter for the bucket
     */
    public function __construct(
        string $name,
        string $field,
        array $childAggregations = [],
        ?string $nestedPath = null,
        ?QueryInterface $filter = null,
        ?QueryInterface $nestedFilter = null
    ) {
        $this->name = $name;
        $this->field = $field;
        $this->childAggregations = $childAggregations;
        $this->nestedPath = $nestedPath;
        $this->filter = $filter;
        $this->nestedFilter = $nestedFilter;
    }

    /**
     * {@inheritDoc}
     */
    public function getField(): string
    {
        return $this->field;
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
    public function isNested(): bool
    {
        return null !== $this->nestedPath;
    }

    /**
     * {@inheritDoc}
     */
    public function getNestedPath(): ?string
    {
        return $this->nestedPath;
    }

    /**
     * {@inheritDoc}
     */
    public function getNestedFilter(): ?QueryInterface
    {
        return $this->nestedFilter;
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
    public function getChildAggregations(): array
    {
        return $this->childAggregations;
    }
}
