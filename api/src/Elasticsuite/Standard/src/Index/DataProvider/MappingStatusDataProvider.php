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

namespace Elasticsuite\Index\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Elasticsuite\Index\Model\Index\Mapping\Status;
use Elasticsuite\Index\Repository\Metadata\MetadataRepository;
use Elasticsuite\Index\Service\IndexManager;

class MappingStatusDataProvider implements RestrictedDataProviderInterface, ItemDataProviderInterface, QueryItemResolverInterface
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private IndexManager $indexManager
    ) {
    }

    public function __invoke($item, array $context)
    {
        return $this->getItem(Status::class, $context['args']['entityType'], null, $context);
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = [])
    {
        $metadata = $this->metadataRepository->findOneBy(['entity' => $id]);

        return $metadata ? $this->indexManager->getMappingStatus($metadata) : null;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Status::class === $resourceClass;
    }
}
