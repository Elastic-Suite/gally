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

namespace Elasticsuite\Search\Compiler;

use Elasticsuite\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
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

        $taggedServices = $container->findTaggedServiceIds('elasticsuite.container_configuration.factory');

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
