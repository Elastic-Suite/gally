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

namespace Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\Assembler;

use Elasticsuite\Search\Elasticsearch\Adapter\Common\Request\Query\AssemblerInterface;
use Elasticsuite\Search\Elasticsearch\Request\QueryInterface;

/**
 * Assemble an ES match_phrase_prefix query.
 */
class MatchPhrasePrefix implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_MATCHPHRASEPREFIX !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\MatchPhrasePrefix $query */
        $searchQueryParams = [
            'query' => $query->getQueryText(),
            'boost' => $query->getBoost(),
            'max_expansions' => $query->getMaxExpansions(),
        ];

        $searchQuery = ['match_phrase_prefix' => [$query->getField() => $searchQueryParams]];

        if ($query->getName()) {
            $searchQuery['match_phrase_prefix']['_name'] = $query->getName();
        }

        return $searchQuery;
    }
}
