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

namespace Elasticsuite\ScopedEntity\Service;

use Elasticsuite\Catalog\Repository\CatalogRepository;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\ScopedEntity\Model\Scope;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ScopeValidator
{
    public function __construct(
        private CatalogRepository $catalogRepository,
        private LocalizedCatalogRepository $localizedCatalogRepository,
    ) {
    }

    public function validate(int $catalogId, int $localizedCatalogId): Scope
    {
        $catalog = $catalogId ? $this->catalogRepository->find($catalogId) : null;
        if ($catalogId && !$catalog) {
            throw new NotFoundHttpException(sprintf('Catalog with id %d not found.', $catalogId));
        }

        $localizedCatalog = $localizedCatalogId ? $this->localizedCatalogRepository->find($localizedCatalogId) : null;
        if ($localizedCatalogId && !$localizedCatalog) {
            throw new NotFoundHttpException(sprintf('Localized catalog with id %d not found.', $localizedCatalogId));
        }

        return new Scope($catalog, $localizedCatalog);
    }
}
