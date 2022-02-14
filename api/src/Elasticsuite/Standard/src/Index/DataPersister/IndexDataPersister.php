<?php

namespace Elasticsuite\Index\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

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
        return $data instanceof Index;
    }

    /**
     * {@inheritdoc}
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var Index $data */
        $this->indexRepository->create($data->getName(), $data->getAlias());
    }

    /**
     * {@inheritdoc}
     */
    public function remove($data)
    {
        /** @var Index $data */
        $this->indexRepository->delete($data->getName());
    }
}
