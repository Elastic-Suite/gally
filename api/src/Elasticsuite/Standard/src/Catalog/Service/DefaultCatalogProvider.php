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

namespace Elasticsuite\Catalog\Service;

use Elasticsuite\Catalog\Exception\NoCatalogException;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;

class DefaultCatalogProvider
{
    /**
     * @param LocalizedCatalogRepository $localizedCatalogRepository
     */
    public function __construct(
        private LocalizedCatalogRepository $localizedCatalogRepository
    ) {
    }

    public function getDefaultLocalizedCatalog(): LocalizedCatalog
    {
        $catalog = $this->localizedCatalogRepository->findOneBy([], ['isDefault' => 'DESC', 'id' => 'ASC']);
        if (null === $catalog) {
            throw new NoCatalogException();
        }

        return $catalog;
    }
}
