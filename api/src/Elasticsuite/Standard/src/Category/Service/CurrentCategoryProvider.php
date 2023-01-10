<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Category\Service;

use Elasticsuite\Category\Model\Category;
use Elasticsuite\Category\Repository\CategoryRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CurrentCategoryProvider
{
    private ?Category $currentCategory = null;

    public function __construct(private CategoryRepository $categoryRepository)
    {
    }

    public function setCurrentCategory(string $categoryId): void
    {
        $this->currentCategory = $this->categoryRepository->find($categoryId);
        if (null === $this->currentCategory) {
            throw new NotFoundHttpException(sprintf('Category with id %s not found.', $categoryId));
        }
    }

    public function getCurrentCategory(): ?Category
    {
        return $this->currentCategory;
    }
}
