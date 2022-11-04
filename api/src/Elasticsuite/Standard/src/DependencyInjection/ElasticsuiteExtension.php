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

/**
 * @codeCoverageIgnore
 */
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
                        __DIR__ . '/../Index/Model/',
                        __DIR__ . '/../Metadata/Model/',
                        __DIR__ . '/../Catalog/Model/',
                        __DIR__ . '/../Security/Model/',
                        __DIR__ . '/../Menu/Model/',
                        __DIR__ . '/../Search/Model/',
                        __DIR__ . '/../Category/Model/',
                        __DIR__ . '/../Product/Model/',
                        __DIR__ . '/../RuleEngine/Model/',
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
                        __DIR__ . '/../Menu/Resources/translations',
                        __DIR__ . '/../Catalog/Resources/translations',
                        __DIR__ . '/../User/Resources/translations',
                    ],
                ],
                'validation' => [
                    'enabled' => true,
                    'mapping' => [
                        'paths' => [
                            __DIR__ . '/../Catalog/Resources/config/validator',
                            __DIR__ . '/../Category/Resources/config/validator',
                            __DIR__ . '/../Metadata/Resources/config/validator',
                            __DIR__ . '/../Search/Resources/config/validator',
                        ],
                    ],
                ],
            ]
        );

        $container->prependExtensionConfig(
            'hautelook_alice',
            [
                'fixtures_path' => [
                    'src/User/DataFixtures/fixtures',
                    'src/Catalog/DataFixtures/fixtures',
                    'src/Metadata/DataFixtures/fixtures',
                    'src/Category/DataFixtures/fixtures',
                    'src/Search/DataFixtures/fixtures',
                ],
            ]
        );

        $this->loadElasticsuiteConfig($container);
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
        $loader->load('Metadata/Resources/config/services.yaml');
        if ('test' === $container->getParameter('kernel.environment')) {
            $loader->load('Index/Resources/config/test/services.yaml');
        }
        $loader->load('Fixture/Resources/config/services.yaml');
        $loader->load('Catalog/Resources/config/services.yaml');
        if ('test' === $container->getParameter('kernel.environment')) {
            $loader->load('Catalog/Resources/config/test/services.yaml');
        }
        $loader->load('User/Resources/config/services.yaml');
        $loader->load('Security/Resources/config/services.yaml');
        $loader->load('Cache/Resources/config/services.yaml');
        $loader->load('Menu/Resources/config/services.yaml');
        $loader->load('ResourceMetadata/Resources/config/services.yaml');
        $loader->load('Stitching/Resources/config/services.yaml');
        $loader->load('Entity/Resources/config/services.yaml');
        $loader->load('Search/Resources/config/services.yaml');
        $loader->load('Category/Resources/config/services.yaml');
        if ('test' === $container->getParameter('kernel.environment')) {
            $loader->load('Category/Resources/config/test/services.yaml');
        }
        $loader->load('Product/Resources/config/services.yaml');
        if ('test' === $container->getParameter('kernel.environment')) {
            $loader->load('Product/Resources/config/test/services.yaml');
        }
        $loader->load('Analysis/Resources/config/services.yaml');
        $loader->load('Hydra/Resources/config/services.yaml');
        $loader->load('Locale/Resources/config/services.yaml');
        $loader->load('GraphQl/Resources/config/services.yaml');
        $loader->load('RuleEngine/Resources/config/services.yaml');
        $loader->load('OpenApi/Resources/config/services.yaml');

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $container->setParameter('elasticsuite.indices_settings', $config['indices_settings'] ?? []);
        $container->setParameter('elasticsuite.menu', $config['menu'] ?? []);
        $container->setParameter('elasticsuite.analysis', $config['analysis'] ?? []);

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

    protected function loadElasticsuiteConfig(ContainerBuilder $container): void
    {
        $yamlParser ??= new YamlParser(); // @phpstan-ignore-line
        $isTestMode = 'test' === $container->getParameter('kernel.environment');

        $configFiles = [
            __DIR__ . '/../Index/Resources/config/elasticsuite.yaml',
            __DIR__ . '/../Analysis/Resources/config/elasticsuite_analysis.yaml',
        ];

        if ($isTestMode) {
            array_unshift($configFiles, __DIR__ . '/../Index/Resources/config/test/elasticsuite.yaml');
            $configFiles[] = __DIR__ . '/../Menu/Resources/config/test/elasticsuite_menu.yaml';
        } else {
            $configFiles = array_merge(
                $configFiles,
                [
                    __DIR__ . '/../Catalog/Resources/config/elasticsuite_menu.yaml',
                    __DIR__ . '/../User/Resources/config/elasticsuite_menu.yaml',
                    __DIR__ . '/../Menu/Resources/config/elasticsuite_menu.yaml',
                ]
            );
        }

        foreach ($configFiles as $configFile) {
            $container->prependExtensionConfig(
                'elasticsuite',
                $yamlParser->parseFile($configFile)['elasticsuite'] ?? []
            );
        }
    }
}
