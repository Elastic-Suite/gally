<?php

namespace Elasticsuite\Fixture\Service;

interface ElasticsearchFixturesInterface
{
    public function loadFixturesIndexFiles(array $pathFiles): void;

    public function loadFixturesDocumentFiles(array $pathFiles): void;

    public function deleteTestFixtures(): void;
}
