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

namespace Elasticsuite\Index\MutationResolver;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;
use Elasticsuite\Index\Service\IndexOperation;

class InstallIndexMutation implements MutationResolverInterface
{
    public function __construct(
        private IndexOperation $indexOperation,
        private IndexRepositoryInterface $indexRepository
    ) {
    }

    /**
     * @param object|null  $item    The item to be mutated
     * @param array<mixed> $context Context
     *
     * @return object|null
     */
    public function __invoke($item, array $context)
    {
        /** @var Index $item */
        $index = $this->indexRepository->findByName($item->getName());
        if (null === $index) {
            throw new InvalidArgumentException(sprintf('Index [%s] does not exist', $item->getName()));
        }

        $this->indexOperation->installIndexByName($index->getName());

        // Reload the index to get updated aliases.
        return $this->indexRepository->findByName($item->getName());
    }
}
