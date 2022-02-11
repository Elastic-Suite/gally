<?php

namespace Elasticsuite\Example\Repository\Document;

interface DocumentRepositoryInterface
{
    public function index(string $indexName, array $documents): void;

    public function delete(string $indexName, array $documents): void;
}
