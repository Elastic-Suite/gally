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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\Assembler\Bucket;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Aggregation\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\Aggregation\Bucket\SignificantTerms as SignificantTermsBucket;
use Elasticsuite\Search\Elasticsearch\Request\AggregationInterface;
use Elasticsuite\Search\Elasticsearch\Request\BucketInterface;

/**
 * Assemble an ES significant term aggregation.
 */
class SignificantTerms implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleAggregation(AggregationInterface $aggregation): array
    {
        if (BucketInterface::TYPE_SIGNIFICANT_TERMS !== $aggregation->getType()) {
            throw new \InvalidArgumentException("Aggregation assembler : invalid aggregation type {$aggregation->getType()}.");
        }

        /** @var SignificantTermsBucket $aggregation */
        $aggregationParams = [
            'field' => $aggregation->getField(),
            'size' => $aggregation->getSize(),
            'min_doc_count' => $aggregation->getMinDocCount(),
            $aggregation->getAlgorithm() => new \stdClass(),
        ];

        return ['significant_terms' => $aggregationParams];
    }
}
