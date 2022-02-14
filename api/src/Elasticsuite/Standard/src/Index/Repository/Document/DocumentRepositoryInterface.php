<?php

namespace Elasticsuite\Index\Repository\Document;

interface DocumentRepositoryInterface
{
    public function index(string $indexName, array $documents, bool $instantRefresh = false): void;

    public function delete(string $indexName, array $documents): void;
}
