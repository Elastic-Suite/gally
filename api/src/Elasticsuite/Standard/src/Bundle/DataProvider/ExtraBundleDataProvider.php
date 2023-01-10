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

namespace Elasticsuite\Bundle\DataProvider;

use ApiPlatform\Core\DataProvider\ContextAwareCollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use Elasticsuite\Bundle\Model\ExtraBundle;
use Symfony\Component\HttpKernel\KernelInterface;

class ExtraBundleDataProvider implements ContextAwareCollectionDataProviderInterface, RestrictedDataProviderInterface
{
    public function __construct(private KernelInterface $kernel)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ExtraBundle::class === $resourceClass;
    }

    /**
     * {@inheritDoc}
     */
    public function getCollection(string $resourceClass, string $operationName = null, array $context = []): array
    {
        $extraBundles = [];
        foreach ($this->kernel->getBundles() as $bundle) {
            if (str_starts_with($bundle->getName(), ExtraBundle::ELASTICSUITE_BUNDLE_PREFIX) && ExtraBundle::ELASTICSUITE_STANDARD_BUNDLE != $bundle->getName()) {
                $extraBundles[] = ['id' => $bundle->getName(), 'name' => $bundle->getName()];
            }
        }

        return $extraBundles;
    }
}
