<?php

namespace Elasticsuite\Index\Repository\Index;

use Elasticsuite\Index\Model\Index;

interface IndexRepositoryInterface
{
    /**
     * @return Index[]
     */
    public function findAll(): array;

    public function findByName(string $indexName): ?Index;

    public function create(string $indexName, string $alias): Index;

    public function refresh(array $indexNames): void;

    public function delete(string $indexName): void;
}
