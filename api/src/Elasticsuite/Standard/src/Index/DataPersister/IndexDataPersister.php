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
     * TODO remove me or disable me ?
     *
     * @return object|void
     */
    public function persist($data)
    {
        /** @var Index $data */
        $this->indexRepository->create($data->getName(), [], $data->getAliases());
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
