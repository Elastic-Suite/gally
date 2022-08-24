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

namespace Elasticsuite\Product\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Elasticsuite\Catalog\Repository\LocalizedCatalogRepository;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;
use Elasticsuite\Index\Service\IndexOperation;
use Elasticsuite\Metadata\Repository\MetadataRepository;

class ElasticsearchProductFixtures extends Fixture
{
    public function __construct(
        private ElasticsearchFixtures $elasticsearchFixtures,
        private MetadataRepository $metadataRepository,
        private LocalizedCatalogRepository $catalogRepository,
        private IndexOperation $indexOperation
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // $this->elasticsearchFixtures->loadFixturesIndexFiles([__DIR__ . '/fixtures/product_indices.json']);
        $this->createProductIndices();
        $this->elasticsearchFixtures->loadFixturesDocumentFiles([__DIR__ . '/fixtures/product_documents.json']);
    }

    public function createProductIndices(): void
    {
        $catalogs = $this->catalogRepository->findAll();
        foreach ($catalogs as $catalog) {
            $index = $this->indexOperation->createIndex(
                $this->metadataRepository->findByEntity('product'),
                $catalog
            );
            $this->indexOperation->installIndexByName($index->getName());
        }
    }
}
