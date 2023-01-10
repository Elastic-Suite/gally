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

namespace Elasticsuite\Search\DataPersister\Facet;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use Doctrine\ORM\EntityManagerInterface;
use Elasticsuite\Search\Model\Facet;

final class ConfigurationDataPersister implements DataPersisterInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function supports($data): bool
    {
        return $data instanceof Facet\Configuration;
    }

    /**
     * @param Facet\Configuration $data
     */
    public function persist($data)
    {
        if ($data->getDisplayMode() == $data->getDefaultDisplayMode()) {
            $data->setDisplayMode(null);
        }
        if ($data->getCoverageRate() == $data->getDefaultCoverageRate()) {
            $data->setCoverageRate(null);
        }
        if ($data->getMaxSize() == $data->getDefaultMaxSize()) {
            $data->setMaxSize(null);
        }
        if ($data->getSortOrder() == $data->getDefaultSortOrder()) {
            $data->setSortOrder(null);
        }
        if ($data->getIsRecommendable() == $data->getDefaultIsRecommendable()) {
            $data->setIsRecommendable(null);
        }
        if ($data->getIsVirtual() == $data->getDefaultIsVirtual()) {
            $data->setIsVirtual(null);
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }

    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
