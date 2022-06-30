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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;

/**
 * Assemble Elasticsearch aggregations from search request AggregationInterface queries.
 */
class Assembler implements AssemblerInterface
{
    /**
     * Constructor.
     *
     * @param Query\Assembler      $queryAssembler Query assembler
     * @param AssemblerInterface[] $assemblers     Assemblers implementations
     */
    public function __construct(private Query\Assembler $queryAssembler, private iterable $assemblers = [])
    {
        $assemblers = ($assemblers instanceof \Traversable) ? iterator_to_array($assemblers) : $assemblers;

        $this->assemblers = $assemblers;
    }

    /**
     * Build ES aggregations from search request aggregations.
     *
     * @param AggregationInterface[] $aggregations Aggregations to be converted into ES aggregations
     */
    public function assembleAggregations(array $aggregations = []): array
    {
        $esAggregations = [];

        foreach ($aggregations as $aggregation) {
            $esAggregation = $this->assembleAggregation($aggregation);
            $subAggregations = $esAggregation['aggregations'] ?? [];

            if ($aggregation instanceof BucketInterface) {
                if (!empty($aggregation->getChildAggregations())) {
                    $subAggregations = array_merge(
                        $subAggregations,
                        $this->assembleAggregations($aggregation->getChildAggregations())
                    );
                }

                if (!empty($subAggregations)) {
                    $esAggregation['aggregations'] = $subAggregations;
                }

                if ($aggregation->isNested()) {
                    if ($aggregation->getNestedFilter()) {
                        $esAggregation = [
                            'filter' => $this->queryAssembler->assembleQuery($aggregation->getNestedFilter()),
                            'aggregations' => [$aggregation->getName() => $esAggregation],
                        ];
                    }

                    $esAggregation = [
                        'nested' => ['path' => $aggregation->getNestedPath()],
                        'aggregations' => [$aggregation->getName() => $esAggregation],
                    ];
                }

                if ($aggregation->getFilter()) {
                    $esAggregation = [
                        'filter' => $this->queryAssembler->assembleQuery($aggregation->getFilter()),
                        'aggregations' => [$aggregation->getName() => $esAggregation],
                    ];
                }
            }

            $esAggregations[$aggregation->getName()] = $esAggregation;
        }

        return $esAggregations;
    }

    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        $assembler = $this->getAssembler($aggregation);

        return $assembler->assembleAggregation($aggregation);
    }

    /**
     * Retrieve the specific assembler used to assemble an aggregation.
     *
     * @param AggregationInterface $aggregation Aggregation to be assembled
     */
    private function getAssembler(AggregationInterface $aggregation): AssemblerInterface
    {
        $aggregationType = $aggregation->getType();

        if (!isset($this->assemblers[$aggregationType])) {
            throw new \InvalidArgumentException("Unknown aggregation assembler for {$aggregationType}.");
        }

        return $this->assemblers[$aggregationType];
    }
}
