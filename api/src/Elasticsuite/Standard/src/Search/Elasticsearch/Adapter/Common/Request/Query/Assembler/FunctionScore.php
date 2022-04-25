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
 * Assemble an ES filtered query.
 */
class FunctionScore extends AbstractComplexAssembler implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_FUNCTIONSCORE !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Elasticsuite\Search\Elasticsearch\Request\Query\FunctionScore $query */
        $searchQueryParams = [
            'score_mode' => $query->getScoreMode(),
            'boost_mode' => $query->getBoostMode(),
            'functions' => array_values($query->getFunctions()),
        ];

        // if ($query->getQuery()) {
        $searchQueryParams['query'] = $this->parentAssembler->assembleQuery($query->getQuery());
        // }

        foreach ($searchQueryParams['functions'] as &$function) {
            if (isset($function['filter'])) {
                $function['filter'] = $this->parentAssembler->assembleQuery($function['filter']);
            }
        }

        if ($query->getName()) {
            $searchQueryParams['_name'] = $query->getName();
        }

        return ['function_score' => $searchQueryParams];
    }
}
