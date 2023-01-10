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

namespace Gally\Entity\Model\Doctrine;

use Doctrine\ORM\AbstractQuery;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder as BaseQueryBuilder;

class QueryBuilder extends BaseQueryBuilder
{
    private string|int $hydratationMode = AbstractQuery::HYDRATE_OBJECT;
    private array $forcedRootAliases = [];

    public function getHydratationMode(): string|int
    {
        return $this->hydratationMode;
    }

    public function setHydratationMode(string|int $hydratationMode): void
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
