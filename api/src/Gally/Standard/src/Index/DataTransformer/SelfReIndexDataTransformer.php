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

namespace Gally\Index\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use Gally\Index\Dto\SelfReindexInput;
use Gally\Index\Model\Index;
use Gally\Index\Model\Index\SelfReindex;
use Gally\Index\Service\SelfReindexOperation;

class SelfReIndexDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private SelfReindexOperation $reindexOperation
    ) {
    }

    /**
     * @param object|array<mixed> $data    object on normalize / array on denormalize
     * @param string              $to      target class
     * @param array<mixed>        $context context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        // in the case of an input, the value given here is an array (the JSON decoded).
        // if it's an index we transformed the data already
        if ($data instanceof SelfReindex) {
            return false;
        }

        return SelfReindex::class === $to && SelfReindexInput::class === ($context['input']['class'] ?? null);
    }

    /**
     * @param SelfReindexInput $object  input object
     * @param string           $to      target class
     * @param array<mixed>     $context context
     *
     * @throws \Exception
     */
    public function transform($object, string $to, array $context = []): SelfReindex
    {
        $entityType = $object->entityType;

        return $this->reindexOperation->performReindex($entityType);
    }
}
