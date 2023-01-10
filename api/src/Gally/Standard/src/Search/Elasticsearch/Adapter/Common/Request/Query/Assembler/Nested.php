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
 * Assemble an ES nested query.
 */
class Nested extends AbstractComplexAssembler implements AssemblerInterface
{
    /**
     * {@inheritDoc}
     */
    public function assembleQuery(QueryInterface $query): array
    {
        if (QueryInterface::TYPE_NESTED !== $query->getType()) {
            throw new \InvalidArgumentException("Query assembler : invalid query type {$query->getType()}");
        }

        /** @var \Gally\Search\Elasticsearch\Request\Query\Nested $query */
        $queryParams = [
            'path' => $query->getPath(),
            'score_mode' => $query->getScoreMode(),
            'query' => $this->parentAssembler->assembleQuery($query->getQuery()),
            'boost' => $query->getBoost(),
        ];

        if ($query->getName()) {
            $queryParams['_name'] = $query->getName();
        }

        return ['nested' => $queryParams];
    }
}
