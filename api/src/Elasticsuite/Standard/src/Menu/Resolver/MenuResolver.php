<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Menu\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Elasticsuite\Menu\Model\Menu;
use Elasticsuite\Menu\Service\MenuBuilder;
use Exception;

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
