<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Acme\Example\Example\Model\ExampleDocument;
use Acme\Example\Example\Repository\Document\DocumentRepositoryInterface;

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
        return $data instanceof ExampleDocument;
    }

    /**
     * {@inheritdoc}
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var ExampleDocument $data */
        $this->documentRepository->index($data->getIndexName(), $data->getDocuments());
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data)
    {
        /** @var ExampleDocument $data */
        // Todo: not working, documents parameter should be added.
        $this->documentRepository->delete($data->getIndexName(), $data->getDocuments());
    }
}
