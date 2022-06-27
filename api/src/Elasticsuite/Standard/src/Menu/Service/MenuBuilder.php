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

namespace Elasticsuite\Menu\Service;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Elasticsuite\Menu\Model\Menu;
use Elasticsuite\Menu\Model\MenuItem;
use Symfony\Contracts\Translation\TranslatorInterface;

class MenuBuilder
{
    public function __construct(
        private array $menuConfiguration,
        private TranslatorInterface $translator,
    ) {
    }

    public function build(): ?Menu
    {
        $menuItems = ['root' => new MenuItem('root')];

        foreach ($this->menuConfiguration as $entry => $data) {
            $parentCode = $data['parent'] ?? 'root';
            $item = new MenuItem(
                $entry,
                $this->translator->trans("elasticsuite.menu.$entry.label", [], 'menu'),
                $data['order'] ?? null,
                $data['css_class'] ?? null,
            );
            $parentItem = $menuItems[$parentCode] ?? null;
            if (!$parentItem) {
                throw new InvalidArgumentException(sprintf('The menu item with code %s should de declared before used as a parent', $parentCode));
            }

            $parentItem->addChild($item);
            $menuItems[$entry] = $item;
        }

        return new Menu($menuItems['root']);
    }
}
