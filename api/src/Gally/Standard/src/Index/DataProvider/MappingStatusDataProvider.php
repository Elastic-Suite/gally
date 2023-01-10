<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Index\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use Gally\Index\Model\Index\Mapping\Status;
use Gally\Index\Service\MetadataManager;
use Gally\Metadata\Repository\MetadataRepository;

class MappingStatusDataProvider implements RestrictedDataProviderInterface, ItemDataProviderInterface, QueryItemResolverInterface
{
    public function __construct(
        private MetadataRepository $metadataRepository,
        private MetadataManager $metadataManager
    ) {
    }

    /**
     * @param mixed $item
     *
     * @return ?Status
     */
    public function __invoke($item, array $context)
    {
        return $this->getItem(Status::class, $context['args']['entityType'], null, $context);
    }

    /**
     * @param mixed $id
     *
     * @return ?Status
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = [])
    {
        $metadata = $this->metadataRepository->findOneBy(['entity' => $id]);

        return $metadata ? $this->metadataManager->getMappingStatus($metadata) : null;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Status::class === $resourceClass;
    }
}
