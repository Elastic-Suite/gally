<?php

namespace Elasticsuite\Example\Repository\Index;

use Elasticsuite\Example\Model\ExampleIndex;

interface IndexRepositoryInterface
{
    /**
     * @return ExampleIndex[]
     */
    public function findAll(): array;

    public function findByName(string $indexName): ?ExampleIndex;

    public function create(string $indexName): ExampleIndex;

    public function delete(string $indexName): void;
}
