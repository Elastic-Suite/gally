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
 * Assemble an ES match query.
 */
class MatchQuery implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_MATCH !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Gally\Search\Elasticsearch\Request\Query\MatchQuery $query */
        $searchQueryParams = [
            'query' => $query->getQueryText(),
            'minimum_should_match' => $query->getMinimumShouldMatch(),
            'boost' => $query->getBoost(),
        ];

        $searchQuery = ['match' => [$query->getField() => $searchQueryParams]];

        if ($query->getName()) {
            $searchQuery['match']['_name'] = $query->getName();
        }

        return $searchQuery;
    }
}
