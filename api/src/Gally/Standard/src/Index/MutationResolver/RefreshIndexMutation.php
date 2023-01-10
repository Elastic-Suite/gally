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

namespace Gally\Index\MutationResolver;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Gally\Index\Model\Index;
use Gally\Index\Repository\Index\IndexRepositoryInterface;

class RefreshIndexMutation implements MutationResolverInterface
{
    public function __construct(
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

        $this->indexRepository->refresh([$index->getName()]);

        return $index;
    }
}
