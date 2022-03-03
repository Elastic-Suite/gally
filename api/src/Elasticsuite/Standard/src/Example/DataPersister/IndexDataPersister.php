<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @category  Elasticsuite
 * @package   Elasticsuite\Example
 * @author    Botis <botis@smile.fr>
 * @copyright 2022 Smile
 * @license   Licensed to Smile-SA. All rights reserved. No warranty, explicit or implicit, provided.
 *            Unauthorized copying of this file, via any medium, is strictly prohibited.
 */

declare(strict_types=1);

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
