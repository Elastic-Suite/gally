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

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Gally\Index\Service\SelfReindexOperation;

class SelfReindexMutation implements MutationResolverInterface
{
    public function __construct(
        private SelfReindexOperation $reindexOperation
    ) {
    }

    /**
     * Handle mutation.
     *
     * @param object|null  $item    The item to be mutated
     * @param array<mixed> $context Context
     *
     * @throws \Exception
     *
     * @return object|null The mutated item
     */
    public function __invoke($item, array $context)
    {
        $entityType = $context['args']['input']['entityType'];

        return $this->reindexOperation->performReindex($entityType);
    }
}
