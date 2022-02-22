<?php

namespace Elasticsuite\Index\Decoration\Metadata\Document\Factory;

use ApiPlatform\Core\Bridge\Elasticsearch\Exception\IndexNotFoundException;
use ApiPlatform\Core\Bridge\Elasticsearch\Metadata\Document\DocumentMetadata;
use ApiPlatform\Core\Bridge\Elasticsearch\Metadata\Document\Factory\DocumentMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use Elasticsuite\Fixture\Service\ElasticsearchFixtures;

/**
 * Creates document's metadata using the attribute configuration elasticsuite_index and elasticsuite_type.
 */
class AttributeDocumentMetadataFactory implements DocumentMetadataFactoryInterface
{

    public function __construct(
        private ElasticsearchFixtures $elasticsearchFixtures,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
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
            $resourceMetadata = $resourceMetadata ?? $this->resourceMetadataFactory->create($resourceClass);

            if (null !== $index = $resourceMetadata->getAttribute('elasticsuite_index')) {
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

            if (null !== $type = $resourceMetadata->getAttribute('elasticsuite_type')) {
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
