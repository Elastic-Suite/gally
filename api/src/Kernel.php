<?php

declare(strict_types=1);

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    protected function buildContainer(): ContainerBuilder
    {
        $container = parent::buildContainer();

        $routePrefix = $container->getParameter('route_prefix');
        $container->setParameter('target_route_prefix', $routePrefix ? "/$routePrefix" : '');

        return $container;
    }
}
