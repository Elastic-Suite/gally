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

namespace Elasticsuite\Product\Service;

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
