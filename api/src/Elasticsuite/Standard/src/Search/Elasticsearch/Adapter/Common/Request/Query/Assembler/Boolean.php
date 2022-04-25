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
 * Assemble an ES bool query.
 */
class Boolean extends AbstractComplexAssembler implements AssemblerInterface
{
    public const QUERY_CONDITION_MUST = 'must';
    public const QUERY_CONDITION_NOT = 'must_not';
    public const QUERY_CONDITION_SHOULD = 'should';

    private array $booleanClauses = [
        self::QUERY_CONDITION_MUST,
        self::QUERY_CONDITION_NOT,
        self::QUERY_CONDITION_SHOULD,
    ];

    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_BOOL !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\Boolean $query */
        $searchQuery = [];

        foreach ($this->booleanClauses as $clause) {
            $queries = array_map(
                [$this->parentAssembler, 'assembleQuery'],
                $this->getQueryClause($query, $clause)
            );
            $searchQuery[$clause] = array_filter($queries);
        }

        if (!empty($searchQuery[self::QUERY_CONDITION_SHOULD])) {
            $searchQuery['minimum_should_match'] = $query->getMinimumShouldMatch();
        }

        $searchQuery['boost'] = $query->getBoost();

        if ($query->isCached()) {
            $searchQuery['_cache'] = true;
        }

        if ($query->getName()) {
            $searchQuery['_name'] = $query->getName();
        }

        return ['bool' => $searchQuery];
    }

    /**
     * Return the list of queries associated to a clause.
     *
     * @param QueryInterface $query  Bool query
     * @param string         $clause Current clause (must, should, must_not)
     *
     * @return QueryInterface[]
     */
    private function getQueryClause(QueryInterface $query, string $clause): array
    {
        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\Boolean $query */
        $queries = $query->getMust();

        if (self::QUERY_CONDITION_NOT == $clause) {
            $queries = $query->getMustNot();
        } elseif (self::QUERY_CONDITION_SHOULD == $clause) {
            $queries = $query->getShould();
        }

        return $queries;
    }
}
