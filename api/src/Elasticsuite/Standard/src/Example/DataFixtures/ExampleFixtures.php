<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Example
 * @author    Botis <botis@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

namespace Elasticsuite\Example\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;

/**
 * Must be declared as a service with the tag doctrine.fixture.orm.
 * Documentation: https://symfony.com/bundles/DoctrineFixturesBundle/current/index.html.
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
