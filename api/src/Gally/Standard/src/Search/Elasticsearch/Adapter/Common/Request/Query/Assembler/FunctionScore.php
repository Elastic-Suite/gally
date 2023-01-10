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

        /** @var \Gally\Search\Elasticsearch\Request\Query\FunctionScore $query */
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
