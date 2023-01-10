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

namespace Elasticsuite\Index\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Elasticsuite\Index\Model\IndexDocument;
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
        return $data instanceof IndexDocument;
    }

    /**
     * {@inheritdoc}
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var IndexDocument $data */
        $this->documentRepository->index($data->getIndexName(), $data->getDocuments());
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data)
    {
        /** @var IndexDocument $data */
        // Todo: not working, documents parameter should be added.
        $this->documentRepository->delete($data->getIndexName(), $data->getDocuments());
    }
}
