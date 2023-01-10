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

namespace Gally\Menu\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Exception;
use Gally\Menu\Model\Menu;
use Gally\Menu\Service\MenuBuilder;

class MenuResolver implements QueryItemResolverInterface
{
    public function __construct(private MenuBuilder $builder)
    {
    }

    /**
     * @param mixed $item
     *
     * @throws Exception
     *
     * @return ?Menu
     */
    public function __invoke($item, array $context)
    {
        return $this->builder->build();
    }
}
