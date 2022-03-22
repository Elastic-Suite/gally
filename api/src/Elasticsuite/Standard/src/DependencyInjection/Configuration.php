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
/**
 * Allows to define Bundle configuration structure, see https://symfony.com/doc/current/components/config/definition.html.
 */

namespace Elasticsuite\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * Example get from https://symfony.com/doc/current/bundles/configuration.html#processing-the-configs-array
     * Concrete examples: vendor/api-platform/core/src/Bridge/Symfony/Bundle/DependencyInjection/Configuration.php.
     *
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('elasticsuite');

        $treeBuilder->getRootNode()
            ->children()
                ->booleanNode('enabled')
                    ->info('Example bundle enabled ?')
                    ->defaultTrue()
                ->end()
                ->arrayNode('twitter')
                    ->info('Twitter example config, has to be removed !')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->integerNode('client_id')
                            ->defaultValue('')
                        ->end()
                        ->scalarNode('client_secret')
                            ->defaultValue('')
                        ->end()
                    ->end()
                ->end()
                //@todo remove twitter example
                ->arrayNode('entities')
                    ->useAttributeAsKey('name')
                    ->arrayPrototype()
                        ->children()
                            ->arrayNode('static_fields')
                                ->arrayPrototype()
                                    ->children()
                                        ->scalarNode('name')->end()
                                        ->scalarNode('type')->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('indices_settings')
                    ->children()
                        ->scalarNode('alias')
                            ->isRequired()
                        ->end()
                        ->scalarNode('indices_pattern')
                            ->isRequired()
                        ->end()
                        ->integerNode('number_of_shards')
                            ->isRequired()
                            ->min(1)
                        ->end()
                        ->integerNode('number_of_replicas')
                            ->isRequired()
                            ->min(0)
                        ->end()
                        ->integerNode('batch_indexing_size')
                            ->isRequired()
                            ->min(1)
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
