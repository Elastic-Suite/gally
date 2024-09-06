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

        $routePrefix = getenv('API_ROUTE_PREFIX');
        $container->setParameter('target_route_prefix', $routePrefix ? "/$routePrefix" : '');

        return $container;
    }
}
