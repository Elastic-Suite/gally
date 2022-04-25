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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Assemble an ES mlt query.
 */
class MoreLikeThis implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_MORELIKETHIS !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\MoreLikeThis $query */
        $searchQueryParams = [
            'fields' => $query->getFields(),
            'minimum_should_match' => $query->getMinimumShouldMatch(),
            'boost' => $query->getBoost(),
            'like' => $query->getLike(),
            'boost_terms' => $query->getBoostTerms(),
            'min_term_freq' => $query->getMinTermFreq(),
            'min_doc_freq' => $query->getMinDocFreq(),
            'max_doc_freq' => $query->getMaxDocFreq(),
            'max_query_terms' => $query->getMaxQueryTerms(),
            'include' => $query->includeOriginalDocs(),
        ];

        if ($query->getName()) {
            $searchQueryParams['_name'] = $query->getName();
        }

        return ['more_like_this' => $searchQueryParams];
    }
}
