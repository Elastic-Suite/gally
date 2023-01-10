<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Acme\Example
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\DataFixtures;

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
