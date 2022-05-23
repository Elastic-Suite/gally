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

namespace Elasticsuite\Entity\Model\Doctrine;

use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder as BaseQueryBuilder;

class QueryBuilder extends BaseQueryBuilder
{
    private string $hydratationMode;
    private array $forcedRootAliases = [];

    public function getHydratationMode(): string
    {
        return $this->hydratationMode;
    }

    public function setHydratationMode(string $hydratationMode): void
    {
        $this->hydratationMode = $hydratationMode;
    }

    public function getRootAliases(): array
    {
        return empty($this->forcedRootAliases) ? parent::getRootAliases() : $this->forcedRootAliases;
    }

    public function setForcedRootAliases(array $forcedRootAliases): void
    {
        $this->forcedRootAliases = $forcedRootAliases;
    }

    /**
     * {@inheritDoc}
     *
     * @return Query
     */
    public function getQuery()
    {
        $query = parent::getQuery();
        $query->setHydrationMode($this->getHydratationMode());

        return $query;
    }
}
