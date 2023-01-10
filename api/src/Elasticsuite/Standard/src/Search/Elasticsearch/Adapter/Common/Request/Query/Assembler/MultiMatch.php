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
 * Assemble an ES multi match match query.
 */
class MultiMatch implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_MULTIMATCH !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\MultiMatch $query */
        $fields = [];

        foreach ($query->getFields() as $field => $weight) {
            $fields[] = sprintf('%s^%s', $field, $weight);
        }

        $searchQueryParams = [
            'query' => $query->getQueryText(),
            'fields' => $fields,
            'minimum_should_match' => $query->getMinimumShouldMatch(),
            'tie_breaker' => $query->getTieBreaker(),
            'boost' => $query->getBoost(),
            'type' => $query->getMatchType(),
        ];

        if ($query->getCutoffFrequency()) {
            $searchQueryParams['cutoff_frequency'] = $query->getCutoffFrequency();
        }

        if ($query->getFuzzinessConfiguration()) {
            $searchQueryParams['fuzziness'] = $query->getFuzzinessConfiguration()->getValue();
            $searchQueryParams['prefix_length'] = $query->getFuzzinessConfiguration()->getPrefixLength();
            $searchQueryParams['max_expansions'] = $query->getFuzzinessConfiguration()->getMaxExpansion();
        }

        if ($query->getName()) {
            $searchQueryParams['_name'] = $query->getName();
        }

        return ['multi_match' => $searchQueryParams];
    }
}
