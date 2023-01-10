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

namespace Gally\Search\Compiler;

use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Reference;

class GetContainerConfigurationFactory implements CompilerPassInterface
{
    public function process(ContainerBuilder $container): void
    {
        if (!$container->has(ContainerConfigurationProvider::class)) { //@phpstan-ignore-line
            return;
        }

        $containerConfigProviderDef = $container->findDefinition(ContainerConfigurationProvider::class); //@phpstan-ignore-line

        $taggedServices = $container->findTaggedServiceIds('gally.container_configuration.factory');

        foreach ($taggedServices as $id => $tags) {
            foreach ($tags as $attributes) {
                $containerConfigProviderDef->addMethodCall(
                    'addContainerConfigFactory', [
                        $attributes['requestType'],
                        new Reference($id),
                        $attributes['metadata'] ?? 'generic',
                    ]
                );
            }
        }
    }
}
