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

namespace Gally\Category\Controller;

use Gally\Category\Service\CategoryTreeBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class GetCategoryTree extends AbstractController
{
    public function __construct(
        private CategoryTreeBuilder $categoryTreeBuilder,
    ) {
    }

    public function __invoke(Request $request)
    {
        $catalogId = $request->query->get('catalogId');
        $catalogId = $catalogId ? (int) $catalogId : null;
        $localizedCatalogId = $request->query->get('localizedCatalogId');
        $localizedCatalogId = $localizedCatalogId ? (int) $localizedCatalogId : null;

        return $this->categoryTreeBuilder->buildTree($catalogId, $localizedCatalogId);
    }
}
