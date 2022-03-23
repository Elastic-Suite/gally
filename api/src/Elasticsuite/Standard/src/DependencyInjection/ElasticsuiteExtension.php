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
use Symfony\Component\Yaml\Yaml;

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
        $apiPlatformConfig = $yamlParser->parseFile(__DIR__ . '/../Config/Resources/config/api_platform.yaml', Yaml::PARSE_CONSTANT);
        $container->prependExtensionConfig('api_platform', $apiPlatformConfig['api_platform']);
        $container->prependExtensionConfig(
            'api_platform',
            [
                'mapping' => [
                    'paths' => [
                        __DIR__ . '/../Example/Model/',
                        __DIR__ . '/../Index/Model/',
                        __DIR__ . '/../Catalog/Model/',
                        __DIR__ . '/../Security/Model/',
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
                'validation' => [
                    'enabled' => true,
                    'mapping' => [
                        'paths' => [
                            __DIR__ . '/../Catalog/Resources/config/validator',
                            __DIR__ . '/../Index/Resources/config/validator',
                        ],
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
                    'src/Catalog/DataFixtures/fixtures',
                    'src/Index/DataFixtures/fixtures',
                ],
            ]
        );

        $elasticsuiteConfig = array_merge_recursive(
            $yamlParser->parseFile(__DIR__ . '/../Catalog/Resources/config/elasticsuite.yaml'),
            $yamlParser->parseFile(__DIR__ . '/../Index/Resources/config/elasticsuite.yaml'),
        );
        if (isset($elasticsuiteConfig['elasticsuite']['indices_settings']['alias'])
            && ('test' === $container->getParameter('kernel.environment'))
        ) {
            $elasticsuiteConfig['elasticsuite']['indices_settings']['alias'] =
                'test_' . $elasticsuiteConfig['elasticsuite']['indices_settings']['alias'];
        }
        $container->prependExtensionConfig('elasticsuite', $elasticsuiteConfig['elasticsuite']);
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
        if ('test' === $container->getParameter('kernel.environment')) {
            $loader->load('Index/Resources/config/test/services.yaml');
        }
        $loader->load('Fixture/Resources/config/services.yaml');
        $loader->load('Catalog/Resources/config/services.yaml');
        $loader->load('User/Resources/config/services.yaml');
        $loader->load('Security/Resources/config/services.yaml');
        $loader->load('Cache/Resources/config/services.yaml');

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $container->setParameter('elasticsuite.enabled', $config['enabled']);
        $container->setParameter('elasticsuite.twiter.credentials', $config['twitter']);
        $container->setParameter('elasticsuite.entities', $config['entities'] ?? []);
        $container->setParameter('elasticsuite.indices_settings', $config['indices_settings'] ?? []);

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
