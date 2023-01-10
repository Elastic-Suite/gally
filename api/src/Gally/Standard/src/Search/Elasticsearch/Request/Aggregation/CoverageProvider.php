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

namespace Gally\Search\Elasticsearch\Request\Aggregation;

use Gally\Search\Elasticsearch\Adapter;
use Gally\Search\Elasticsearch\RequestInterface;

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
