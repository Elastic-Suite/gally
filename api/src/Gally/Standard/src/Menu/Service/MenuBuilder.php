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

namespace Gally\Menu\Service;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use Gally\Menu\Model\Menu;
use Gally\Menu\Model\MenuItem;
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
                $this->translator->trans("gally.menu.$entry.label", [], 'menu'),
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
