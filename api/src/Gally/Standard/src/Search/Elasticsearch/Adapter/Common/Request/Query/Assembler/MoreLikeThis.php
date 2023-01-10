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

namespace Gally\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Gally\Search\Elasticsearch\Adapter\Common\Request\Query\AssemblerInterface;
use Gally\Search\Elasticsearch\Request\QueryInterface;

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

        /** @var \Gally\Search\Elasticsearch\Request\Query\MoreLikeThis $query */
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
