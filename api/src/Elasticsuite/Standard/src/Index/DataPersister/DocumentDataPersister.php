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

namespace Elasticsuite\Index\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Elasticsuite\Index\Model\Document;
use Elasticsuite\Index\Repository\Document\DocumentRepositoryInterface;

class DocumentDataPersister implements DataPersisterInterface
{
    public function __construct(
        private DocumentRepositoryInterface $documentRepository
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data): bool
    {
        return $data instanceof Document;
    }

    /**
     * {@inheritdoc}
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var Document $data */
        $this->documentRepository->index($data->getIndexName(), $data->getDocuments());
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data)
    {
        /** @var Document $data */
        // Todo: not working, documents parameter should be added.
        $this->documentRepository->delete($data->getIndexName(), $data->getDocuments());
    }
}
