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
 * SF doc: https://symfony.com/doc/current/bundles/extension.html.
 */

namespace Elasticsuite\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Yaml\Parser as YamlParser;

class ElasticsuiteExtension extends Extension implements PrependExtensionInterface
{
    /**
     * Allows to set config for others bundles.
     *
     * {@inheritdoc}
     */
    public function prepend(ContainerBuilder $container)
    {
        $yamlParser ??= new YamlParser(); // @phpstan-ignore-line
        $apiPlatformConfig = $yamlParser->parseFile(__DIR__ . '/../Example/Resources/config/api_platform.yaml');
        $container->prependExtensionConfig('api_platform', $apiPlatformConfig['api_platform']);
        $container->prependExtensionConfig(
            'api_platform',
            [
                'mapping' => [
                    'paths' => [
                        __DIR__ . '/../Example/Model/',
                        __DIR__ . '/../Index/Model/',
                    ],
                ],
            ]
        );

        $container->prependExtensionConfig(
            'framework',
            [
                'translator' => [
                    'paths' => [
                        __DIR__ . '/../Example/Resources/translations',
                    ],
                ],
            ]
        );

        $container->prependExtensionConfig(
            'hautelook_alice',
            [
                'fixtures_path' => [
                    'src/Example/DataFixtures/fixtures',
                    'src/User/DataFixtures/fixtures',
                ],
            ]
        );
    }

    /**
     * Allows to load services config and set bundle parameters in container.
     *
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader(
            $container,
            new FileLocator(__DIR__ . '/../')
        );

        $loader->load('Example/Resources/config/services.yaml');
        $loader->load('Index/Resources/config/services.yaml');
        $loader->load('Fixture/Resources/config/services.yaml');
        $loader->load('User/Resources/config/services.yaml');
        $loader->load('Security/Resources/config/services.yaml');
        $loader->load('Cache/Resources/config/services.yaml');

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $container->setParameter('elasticsuite.enabled', $config['enabled']);
        $container->setParameter('elasticsuite.twiter.credentials', $config['twitter']);

        //@Todo : Use this feature https://symfony.com/doc/current/bundles/extension.html ?
//        $this->addAnnotatedClassesToCompile([
//            // you can define the fully qualified class names...
//            'App\\Controller\\DefaultController',
//            // ... but glob patterns are also supported:
//            '**Bundle\\Controller\\',
//
//            // ...
//        ]);
    }
}
