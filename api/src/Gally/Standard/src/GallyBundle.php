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

namespace Gally;

use Doctrine\Bundle\DoctrineBundle\DependencyInjection\Compiler\DoctrineOrmMappingsPass;
use Gally\Search\Compiler\GetContainerConfigurationFactory;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * @codeCoverageIgnore
 */
class GallyBundle extends Bundle
{
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }

    public function build(ContainerBuilder $container): void
    {
        $mappings = [
            realpath(__DIR__ . '/Catalog/Resources/config/doctrine') => 'Gally\Catalog\Model',
            realpath(__DIR__ . '/Category/Resources/config/doctrine') => 'Gally\Category\Model',
            realpath(__DIR__ . '/Metadata/Resources/config/doctrine') => 'Gally\Metadata\Model',
            realpath(__DIR__ . '/User/Resources/config/doctrine') => 'Gally\User\Model',
            realpath(__DIR__ . '/Search/Resources/config/doctrine') => 'Gally\Search\Model',
        ];

        $container->addCompilerPass(
            DoctrineOrmMappingsPass::createXmlMappingDriver(
                $mappings,
                ['doctrine.orm.entity_manager'],
                false
            )
        );
        $container->addCompilerPass(new GetContainerConfigurationFactory());
    }
}
