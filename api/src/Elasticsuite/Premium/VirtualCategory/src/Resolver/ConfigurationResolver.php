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

namespace Elasticsuite\VirtualCategory\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Elasticsuite\Category\Repository\CategoryRepository;
use Elasticsuite\ScopedEntity\Service\ScopeValidator;
use Elasticsuite\VirtualCategory\Model\Configuration;
use Elasticsuite\VirtualCategory\Repository\ConfigurationRepository;
use Exception;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ConfigurationResolver implements QueryItemResolverInterface
{
    public function __construct(
        private ConfigurationRepository $configurationRepository,
        private CategoryRepository $categoryRepository,
        private ScopeValidator $scopeValidator,
    ) {
    }

    /**
     * @param mixed $item
     *
     * @throws Exception
     *
     * @return ?Configuration
     */
    public function __invoke($item, array $context)
    {
        $categoryId = $context['args']['categoryId'];
        $category = $this->categoryRepository->find($categoryId);
        if (!$category) {
            throw new NotFoundHttpException(sprintf('Category with id %s not found.', $categoryId));
        }

        $scope = $this->scopeValidator->validate(
            $context['args']['catalogId'],
            $context['args']['localizedCatalogId'],
        );

        $config = $this->configurationRepository->findOneMergedByContext($category, $scope);
        if (!$config) {
            throw new NotFoundHttpException('Not found');
        }

        return $config;
    }
}
