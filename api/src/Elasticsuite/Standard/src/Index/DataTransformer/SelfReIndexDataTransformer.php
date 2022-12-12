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

namespace Elasticsuite\Index\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use Elasticsuite\Index\Dto\SelfReindexInput;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Model\Index\SelfReindex;
use Elasticsuite\Index\Service\SelfReindexOperation;

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
