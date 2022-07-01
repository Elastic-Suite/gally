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

namespace Elasticsuite\Category\Model;

use ApiPlatform\Core\Annotation\ApiResource;
use Elasticsuite\Catalog\Model\LocalizedCatalog;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
class Category
{
    private int $id;

    private string $categoryId;

    private LocalizedCatalog $catalog;

    private ?string $parentId = null;

    private int $level = 0;

    private string $path = '';

    private string $name = '';

    private bool $isVirtual = false;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCategoryId(): string
    {
        return $this->categoryId;
    }

    public function setCategoryId(string $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function getCatalog(): LocalizedCatalog
    {
        return $this->catalog;
    }

    public function setCatalog(LocalizedCatalog $catalog): void
    {
        $this->catalog = $catalog;
    }

    public function getParentId(): ?string
    {
        return $this->parentId;
    }

    public function setParentId(?string $parentId): void
    {
        $this->parentId = $parentId;
    }

    public function getLevel(): int
    {
        return $this->level;
    }

    public function setLevel(int $level): void
    {
        $this->level = $level;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $path): void
    {
        $this->path = $path;
    }

    #[Groups(['facet_configuration:graphql_read'])]
    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getIsVirtual(): bool
    {
        return $this->isVirtual;
    }

    public function setIsVirtual(bool $isVirtual): void
    {
        $this->isVirtual = $isVirtual;
    }
}
