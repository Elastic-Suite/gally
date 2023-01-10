<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\Product\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Fixture\Service\ElasticsearchFixturesInterface;
use Elasticsuite\Fixture\Service\EntityIndicesFixturesInterface;

class ElasticsearchProductFixtures extends Fixture
{
    public function __construct(
        private ElasticsearchFixturesInterface $elasticsearchFixtures,
        private EntityIndicesFixturesInterface $entityIndicesFixtures,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $this->entityIndicesFixtures->createEntityElasticsearchIndices('product');
        $this->elasticsearchFixtures->loadFixturesDocumentFiles([__DIR__ . '/sample_data/product_documents.json']);
    }
}
