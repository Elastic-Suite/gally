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

namespace Gally\Category\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Gally\Category\Model\CategoryTree;
use Gally\Category\Service\CategoryTreeBuilder;

class CategoryTreeResolver implements QueryItemResolverInterface
{
    public function __construct(private CategoryTreeBuilder $categoryTreeBuilder)
    {
    }

    /**
     * @param mixed $item
     */
    public function __invoke($item, array $context): CategoryTree
    {
        $catalogId = isset($context['args']['catalogId']) ? (int) $context['args']['catalogId'] : null;
        $localizedCatalogId = isset($context['args']['localizedCatalogId']) ? (int) $context['args']['localizedCatalogId'] : null;

        return $this->categoryTreeBuilder->buildTree($catalogId, $localizedCatalogId);
    }
}
