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

/**
 * @codeCoverageIgnore
 */
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
                // Menu config
                ->arrayNode('menu')
                    ->useAttributeAsKey('code')
                    ->arrayPrototype()
                        ->children()
                            ->scalarNode('order')->end()
                            ->scalarNode('css_class')->end()
                            ->scalarNode('parent')->end()
                        ->end()
                    ->end()
                ->end()

                // Analysis config
                ->arrayNode('analysis')
                    ->useAttributeAsKey('language')
                    ->arrayPrototype()
                        ->children()
                            ->arrayNode('char_filters')
                                ->useAttributeAsKey('name')
                                ->arrayPrototype()
                                    ->children()
                                        ->scalarNode('type')->isRequired()->end()
                                        ->variableNode('params')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('filters')
                                ->useAttributeAsKey('name')
                                ->arrayPrototype()
                                    ->children()
                                        ->scalarNode('type')->isRequired()->end()
                                        ->variableNode('params')->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('analyzers')
                                ->useAttributeAsKey('name')
                                ->arrayPrototype()
                                    ->children()
                                        ->scalarNode('type')->defaultValue('custom')->end()
                                        ->arrayNode('char_filter')
                                            ->isRequired()
                                            ->scalarPrototype()->end()
                                        ->end()
                                        ->scalarNode('tokenizer')->isRequired()->end()
                                        ->arrayNode('filter')
                                            ->isRequired()
                                            ->scalarPrototype()->end()
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                            ->arrayNode('normalizers')
                                ->useAttributeAsKey('name')
                                ->arrayPrototype()
                                    ->children()
                                        ->scalarNode('type')->defaultValue('custom')->end()
                                        ->arrayNode('char_filter')
                                            ->scalarPrototype()->end()
                                        ->end()
                                        ->arrayNode('filter')
                                            ->isRequired()
                                            ->scalarPrototype()->end()
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()

                // Indices setting config
                ->arrayNode('indices_settings')
                    ->children()
                        ->scalarNode('prefix')
                            ->isRequired()
                        ->end()
                        ->scalarNode('timestamp_pattern')
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
                        ->integerNode('time_before_ghost')
                            ->isRequired()
                            ->min(1)
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
