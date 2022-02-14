<?php

namespace Elasticsuite\Example\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;

/**
 * Must be declared as a service with the tag doctrine.fixture.orm.
 * Documentation: https://symfony.com/bundles/DoctrineFixturesBundle/current/index.html
 */
class ExampleFixtures extends Fixture
{
    public function __construct(
        private ElasticsearchFixtures $elasticsearchFixtures,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $this->elasticsearchFixtures->loadFixturesIndexFiles([__DIR__ . '/fixtures/index_example.json']);
        $this->elasticsearchFixtures->loadFixturesDocumentFiles([__DIR__ . '/fixtures/products_example.json']);
    }
}
