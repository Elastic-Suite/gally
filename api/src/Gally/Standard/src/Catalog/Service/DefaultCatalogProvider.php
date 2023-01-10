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

namespace Gally\Catalog\Service;

use Gally\Catalog\Exception\NoCatalogException;
use Gally\Catalog\Model\LocalizedCatalog;
use Gally\Catalog\Repository\LocalizedCatalogRepository;

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
