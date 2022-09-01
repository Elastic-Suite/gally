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

namespace Elasticsuite\VirtualCategory\Repository;

use Elasticsuite\Category\Model\Category;
use Elasticsuite\ScopedEntity\Model\Scope;
use Elasticsuite\ScopedEntity\Repository\AbstractRepository;
use Elasticsuite\VirtualCategory\Model\Configuration;

/**
 * @method Configuration|null find($id, $lockMode = null, $lockVersion = null)
 * @method Configuration|null findOneBy(array $criteria, array $orderBy = null)
 * @method Configuration[]    findAll()
 * @method Configuration[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ConfigurationRepository extends AbstractRepository
{
    /**
     * Get the configuration of a given category for the given context.
     * If a parameter is not defined in this context, we get the value from the parent context
     * (ex: if isVirtual is null for this localized catalog, we get the value for this category on the catalog).
     */
    public function findOneMergedByContext(Category $category, Scope $scope): ?Configuration
    {
        $localizedCatalog = $scope->getLocalizedCatalog();

        if (!$localizedCatalog && $scope->getCatalog()) {
            $localizedCatalog = $scope->getCatalog()->getLocalizedCatalogs()->first();
        }

        $queryBuilder = $this->buildScopedQuery($scope, $category, Category::class, 'category');

        $results = $queryBuilder->getQuery()->getResult();
        $result = reset($results);
        $configuration = new Configuration();

        // Api can't return data without IRI, so without id.
        // We need to set 0 id for configuration that not exist yet in db.
        $configuration->setId($result['id'] ?: 0);
        $configuration->setCategory($category);
        $configuration->setCatalog($scope->getCatalog());
        $configuration->setLocalizedCatalog($localizedCatalog);
        $configuration->setIsVirtual((bool) $result['isVirtual']);

        return $configuration;
    }
}
