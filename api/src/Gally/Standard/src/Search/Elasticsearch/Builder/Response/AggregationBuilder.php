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

namespace Gally\Search\Elasticsearch\Builder\Response;

use Gally\Search\Elasticsearch\Adapter\Common\Response\Aggregation;
use Gally\Search\Elasticsearch\Adapter\Common\Response\AggregationInterface;
use Gally\Search\Elasticsearch\Adapter\Common\Response\BucketValue;

/**
 * Builder for aggregation part of the search response.
 */
class AggregationBuilder
{
    public const OTHER_DOCS_KEY = '__other_docs';

    /**
     * Build an aggregation object from the search engine response.
     *
     * @param string $field          aggregation field
     * @param array  $rawAggregation aggregation data as it is in elasticsearch response
     */
    public function create(string $field, array $rawAggregation): AggregationInterface
    {
        // Nested aggregations support.
        while (\array_key_exists($field, $rawAggregation)) {
            $rawAggregation = $rawAggregation[$field];
        }

        $values = isset($rawAggregation['buckets'])
            ? $this->getBucketValues($rawAggregation)
            : $this->getAggregationValues($rawAggregation);

        $count = array_reduce($values, function ($count, $value) {
            return $value instanceof BucketValue ? $count + $value->getCount() : null;
        });

        return new Aggregation($field, $values, $count);
    }

    /**
     * Return a bucket from an ES aggregation.
     *
     * @param array $rawAggregation aggregation data as it is in elasticsearch response
     */
    private function getBucketValues(array $rawAggregation): array
    {
        $values = [];

        if (isset($rawAggregation['sum_other_doc_count']) && $rawAggregation['sum_other_doc_count'] > 0) {
            $rawAggregation['buckets'][self::OTHER_DOCS_KEY]['doc_count'] = $rawAggregation['sum_other_doc_count'];
        }

        foreach ($rawAggregation['buckets'] as $key => $value) {
            if (isset($value['key'])) {
                $key = $value['key'];
                unset($value['key']);
            }

            $values[(string) ($value['key_as_string'] ?? $key)] = new BucketValue(
                $key,
                (int) ($value['doc_count'] ?? 0),
                $this->getSubAggregations($value)
            );
        }

        return $values;
    }

    /**
     * Parse an aggregation and returns values.
     *
     * @param array $rawAggregation aggregation data as it is in elasticsearch response
     */
    private function getAggregationValues(array $rawAggregation): array
    {
        $values = [];
        $keysToUnset = [];

        foreach ($rawAggregation as $valueName => $value) {
            $valueName = 'doc_count' == $valueName ? 'count' : $valueName;
            if (isset($rawAggregation[$valueName . '_as_string'])) {
                $value = $rawAggregation[$valueName . '_as_string'];
                $keysToUnset[] = $valueName . '_as_string';
            }
            $values[$valueName] = $value;
        }

        foreach ($keysToUnset as $key) {
            unset($values[$key]);
        }

        return $values;
    }

    /**
     * Parse a bucket and returns sub-aggregations.
     *
     * @param array $rawValue bucket data as it is in elasticsearch response
     *
     * @return AggregationInterface[]
     */
    private function getSubAggregations(array $rawValue): array
    {
        $subAggregations = [];

        foreach ($rawValue as $field => $value) {
            if (\is_array($value)) {
                $subAggregations[$field] = $this->create($field, $value);
            }
        }

        return $subAggregations;
    }
}
