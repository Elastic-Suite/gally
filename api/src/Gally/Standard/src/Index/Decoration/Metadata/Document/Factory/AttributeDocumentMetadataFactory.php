<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Index\Decoration\Metadata\Document\Factory;

use ApiPlatform\Core\Bridge\Elasticsearch\Exception\IndexNotFoundException;
use ApiPlatform\Core\Bridge\Elasticsearch\Metadata\Document\DocumentMetadata;
use ApiPlatform\Core\Bridge\Elasticsearch\Metadata\Document\Factory\DocumentMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use Gally\Fixture\Service\ElasticsearchFixtures;
use Gally\ResourceMetadata\Service\ResourceMetadataManager;

/**
 * Creates document's metadata using the attribute configuration gally_index and gally_type.
 */
class AttributeDocumentMetadataFactory implements DocumentMetadataFactoryInterface
{
    public function __construct(
        private ElasticsearchFixtures $elasticsearchFixtures,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ResourceMetadataManager $resourceMetadataManager,
        private ?DocumentMetadataFactoryInterface $decorated = null
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function create(string $resourceClass): DocumentMetadata
    {
        $documentMetadata = null;
        if ($this->decorated) {
            try {
                $documentMetadata = $this->decorated->create($resourceClass);
            } catch (IndexNotFoundException $e) {
            }
        }

        $resourceMetadata = null;

        if (!$documentMetadata || null === $documentMetadata->getIndex()) {
            $resourceMetadata = $this->resourceMetadataFactory->create($resourceClass);

            $index = $this->resourceMetadataManager->getIndex($resourceMetadata);
            if (null !== $index) {
                /**
                 * Todo: call a service to get the index name formatted.
                 */
                $index = 'magento2_default_' . $index;
                $index = $this->elasticsearchFixtures->getTestIndexName($index);

                $documentMetadata = $documentMetadata ? $documentMetadata->withIndex($index) : new DocumentMetadata($index);
            }
        }

        if (!$documentMetadata || DocumentMetadata::DEFAULT_TYPE === $documentMetadata->getType()) {
            $resourceMetadata = $resourceMetadata ?? $this->resourceMetadataFactory->create($resourceClass);

            if (null !== $type = $resourceMetadata->getAttribute('gally_type')) {
                $documentMetadata = $documentMetadata ? $documentMetadata->withType($type) : new DocumentMetadata(null,
                    $type);
            }
        }

        if ($documentMetadata) {
            return $documentMetadata;
        }

        throw new IndexNotFoundException(sprintf('No index associated with the "%s" resource class.', $resourceClass));
    }
}
