<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);
/**
 * Allows to define Bundle configuration structure, see https://symfony.com/doc/current/components/config/definition.html.
 */

namespace Acme\Example\DependencyInjection;

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
        $treeBuilder = new TreeBuilder('acme');

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
            ->end();

        return $treeBuilder;
    }
}
