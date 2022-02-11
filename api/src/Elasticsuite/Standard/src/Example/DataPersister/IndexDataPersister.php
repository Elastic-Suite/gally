<?php

namespace Elasticsuite\Example\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Elasticsuite\Example\Model\ExampleIndex;
use Elasticsuite\Example\Repository\Index\IndexRepositoryInterface;

class IndexDataPersister implements DataPersisterInterface
{
    public function __construct(
        private IndexRepositoryInterface $indexRepository
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supports($data): bool
    {
        return $data instanceof ExampleIndex;
    }

    /**
     * {@inheritdoc}
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var ExampleIndex $data */
        $this->indexRepository->create($data->getName());
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data)
    {
        /** @var ExampleIndex $data */
        $this->indexRepository->delete($data->getName());
    }
}
