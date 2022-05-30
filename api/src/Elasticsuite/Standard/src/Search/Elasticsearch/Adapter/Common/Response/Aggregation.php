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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Response;

class Aggregation implements AggregationInterface
{
    public function __construct(private string $field, private array $values, private ?int $count, private ?string $name = null)
    {
    }

    public function getName(): string
    {
        return $this->name ?? $this->getField();
    }

    public function getField(): string
    {
        return $this->field;
    }

    public function getCount(): ?int
    {
        return $this->count;
    }

    public function getValues(): array
    {
        return $this->values;
    }
}
