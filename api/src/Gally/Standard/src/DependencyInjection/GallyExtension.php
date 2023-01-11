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
/**
 * SF doc: https://symfony.com/doc/current/bundles/extension.html.
 */

namespace Gally\DependencyInjection;

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
class GallyExtension extends Extension implements PrependExtensionInterface
{
    /**
     * Allows to set config for others bundles.
     *
     * {@inheritdoc}
     */
    public function prepend(ContainerBuilder $container)
    {
        $yamlParser ??= new YamlParser(); // @phpstan-ignore-line

        $doctrineMigrationsConfig = $yamlParser->parseFile(__DIR__ . '/../Configuration/Resources/config/doctrine_migrations.yaml', Yaml::PARSE_CONSTANT);
        $container->prependExtensionConfig('doctrine_migrations', $doctrineMigrationsConfig['doctrine_migrations']);

        $apiPlatformConfig = $yamlParser->parseFile(__DIR__ . '/../Configuration/Resources/config/api_platform.yaml', Yaml::PARSE_CONSTANT);
        $container->prependExtensionConfig('api_platform', $apiPlatformConfig['api_platform']);
        $container->prependExtensionConfig(
            'api_platform',
            [
                'mapping' => [
                    'paths' => $this->getPaths(__DIR__ . '/../*/Model/'),
                ],
            ]
        );

        $container->prependExtensionConfig(
            'framework',
            [
                'translator' => [
                    'paths' => $this->getPaths(__DIR__ . '/../*/Resources/translations'),
                ],
                'validation' => [
                    'enabled' => true,
                    'mapping' => [
                        'paths' => $this->getPaths(__DIR__ . '/../*/Resources/config/validator'),
                    ],
                ],
            ]
        );

        $fixturePaths = $this->getPaths(__DIR__ . '/../*/DataFixtures/fixtures', __DIR__ . '/../../');
        if ('dev' === $container->getParameter('kernel.environment')) {
            $fixturePaths = array_merge(
                $fixturePaths,
                $this->getPaths(__DIR__ . '/../*/DataFixtures/sample_data', __DIR__ . '/../../')
            );
        }
        $container->prependExtensionConfig('hautelook_alice', ['fixtures_path' => $fixturePaths]);

        $this->loadGallyConfig($container);
    }

    /**
     * Allows to load services config and set bundle parameters in container.
     *
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__ . '/../'));

        $paths = $this->getPaths(__DIR__ . '/../*/Resources/config/services.yaml', __DIR__ . '/../');
        foreach ($paths as $path) {
            $loader->load($path);
        }

        if ('test' === $container->getParameter('kernel.environment')) {
            $paths = $this->getPaths(__DIR__ . '/../*/Resources/config/test/services.yaml', __DIR__ . '/../');
            foreach ($paths as $path) {
                $loader->load($path);
            }
        }

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $container->setParameter('gally.indices_settings', $config['indices_settings'] ?? []);
        $container->setParameter('gally.menu', $config['menu'] ?? []);
        $container->setParameter('gally.analysis', $config['analysis'] ?? []);
        $container->setParameter('gally.graphql_query_renaming', $config['graphql_query_renaming'] ?? []);
        $container->setParameter('gally.search_settings', $config['search_settings'] ?? []);
        $container->setParameter('gally.relevance', $config['relevance'] ?? []);
        $container->setParameter('gally.base_url', $config['base_url'] ?? []);
        $container->setParameter('gally.request_context', $config['request_context'] ?? []);
        $container->setParameter('gally.default_price_group_id', $config['default_price_group_id'] ?? null);

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

    protected function loadGallyConfig(ContainerBuilder $container): void
    {
        $yamlParser ??= new YamlParser(); // @phpstan-ignore-line
        $isTestMode = 'test' === $container->getParameter('kernel.environment');

        $configFiles = array_merge(
            $this->getPaths(__DIR__ . '/../*/Resources/config/gally.yaml'),
            $this->getPaths(__DIR__ . '/../*/Resources/config/gally_analysis.yaml'),
            $this->getPaths(__DIR__ . '/../*/Resources/config/gally_relevance.yaml'),
            $this->getPaths(__DIR__ . '/../*/Resources/config/gally_configuration.yaml'),
        );

        if ($isTestMode) {
            $configFiles = array_merge(
                $this->getPaths(__DIR__ . '/../*/Resources/config/test/gally*.yaml'),
                $configFiles,
            );
        } else {
            // Don't use getPath for menu conf, the order is important
            $configFiles = array_merge(
                $configFiles,
                [
                    __DIR__ . '/../Catalog/Resources/config/gally_menu.yaml',
                    __DIR__ . '/../User/Resources/config/gally_menu.yaml',
                    __DIR__ . '/../Menu/Resources/config/gally_menu.yaml',
                ]
            );
        }

        foreach ($configFiles as $configFile) {
            $container->prependExtensionConfig(
                'gally',
                $yamlParser->parseFile($configFile, Yaml::PARSE_CONSTANT)['gally'] ?? []
            );
        }
    }

    private function getPaths(string $pattern, ?string $relativeTo = null): array
    {
        $relativeTo = $relativeTo ? realpath($relativeTo) . '/' : '';

        return array_map(
            fn ($path) => str_replace($relativeTo, '', realpath($path)),
            glob($pattern)
        );
    }
}
