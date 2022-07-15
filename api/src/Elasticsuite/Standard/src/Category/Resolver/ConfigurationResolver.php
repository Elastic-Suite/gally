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

namespace Elasticsuite\Category\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Elasticsuite\Category\Model\Category\Configuration;
use Elasticsuite\Category\Repository\CategoryConfigurationRepository;
use Exception;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ConfigurationResolver implements QueryItemResolverInterface
{
    public function __construct(private CategoryConfigurationRepository $configurationRepository)
    {
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
        $config = $this->configurationRepository->findByContext(
            $context['args']['categoryId'],
            $context['args']['catalogId'] ?? null,
            $context['args']['localizedCatalogId'] ?? null,
        );
        if (!$config) {
            throw new NotFoundHttpException('Not found');
        }

        return $config;
    }
}
