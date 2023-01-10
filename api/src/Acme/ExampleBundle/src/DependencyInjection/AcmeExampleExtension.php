<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);
/**
 * SF doc: https://symfony.com/doc/current/bundles/extension.html.
 */

namespace Acme\Example\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Yaml\Parser as YamlParser;

class AcmeExampleExtension extends Extension implements PrependExtensionInterface
{
    /**
     * Allows to set config for others bundles.
     *
     * {@inheritdoc}
     */
    public function prepend(ContainerBuilder $container)
    {
        $yamlParser ??= new YamlParser(); // @phpstan-ignore-line
        $container->prependExtensionConfig(
            'api_platform',
            [
                'mapping' => [
                    'paths' => [
                        __DIR__ . '/../Example/Model/',
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

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);
        $container->setParameter('acme.enabled', $config['enabled']);
        $container->setParameter('acme.twiter.credentials', $config['twitter']);
    }
}
