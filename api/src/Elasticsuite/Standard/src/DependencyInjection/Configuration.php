<?php
/**
 * Allows to define Bundle configuration structure, see https://symfony.com/doc/current/components/config/definition.html
 */
namespace Elasticsuite\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    /**
     * Example get from https://symfony.com/doc/current/bundles/configuration.html#processing-the-configs-array
     * Concrete examples: vendor/api-platform/core/src/Bridge/Symfony/Bundle/DependencyInjection/Configuration.php
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
            ->end()
        ;
        //@todo remove twitter example
        return $treeBuilder;
    }
}
