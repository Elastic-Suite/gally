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

namespace Elasticsuite\Menu\Model;

class MenuItem
{
    public function __construct(
        private string $code,
        private ?string $label = null,
        private ?int $order = null,
        private ?string $cssClass = null,
        private array $children = []
    ) {
        ksort($this->children);
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getLabel(): string
    {
        return $this->label ?: $this->code;
    }

    public function getOrder(): ?int
    {
        return $this->order;
    }

    public function getCssClass(): ?string
    {
        return $this->cssClass;
    }

    /**
     * @return MenuItem[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    public function addChild(self $child): void
    {
        $this->children[] = $child;

        usort(
            $this->children,
            /**
             * @param self $childA
             * @param self $childB
             */
            function ($childA, $childB) {
                return $childA->getOrder() > $childB->getOrder() ? 1 : -1;
            });
    }

    public function asArray(): array
    {
        $children = [];
        foreach ($this->getChildren() as $child) {
            $children[] = $child->asArray();
        }

        $data = [
            'code' => $this->getCode(),
            'label' => $this->getLabel(),
        ];

        if ($this->getOrder()) {
            $data['order'] = $this->getOrder();
        }
        if ($this->getCssClass()) {
            $data['css_class'] = $this->getCssClass();
        }
        if (!empty($children)) {
            $data['children'] = $children;
        }

        return $data;
    }
}
