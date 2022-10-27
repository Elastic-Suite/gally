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

namespace Elasticsuite\Product\Elasticsearch\Request\Aggregation;

use Elasticsuite\Search\Elasticsearch\Adapter;
use Elasticsuite\Search\Elasticsearch\RequestInterface;

/**
 * Catalog Product Search Request coverage provider.
 */
class CoverageProvider
{
    public function __construct(
        private Adapter $searchEngine,
    ) {
    }

    /**
     * Compute calculation of product counts against the engine.
     *
     * @param RequestInterface $request A tailor-made request for coverage calculation (with size=0 and some specific aggregations)
     */
    public function getCoverage(RequestInterface $request): Coverage
    {
        $searchResponse = $this->searchEngine->search($request);

        $countByAttributeCode = [];
        $size = $searchResponse->getTotalItems();
        $aggregations = $searchResponse->getAggregations();

        if (isset($aggregations['indexed_fields'])) {
            $attributeCodeBucket = $aggregations['indexed_fields'];
            foreach ($attributeCodeBucket->getValues() as $value) {
                $countByAttributeCode[$value->getKey()] = $value->getCount();
            }
        }

        return new Coverage($countByAttributeCode, $size);
    }
}
