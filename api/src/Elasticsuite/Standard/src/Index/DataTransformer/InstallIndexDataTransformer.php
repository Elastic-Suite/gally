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

use ApiPlatform\Core\Api\OperationType;
use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Elasticsuite\Index\Dto\InstallIndexInput;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Service\IndexOperation;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class InstallIndexDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private IndexOperation $indexOperation,
    ) {
    }

    /**
     * @param object|array<mixed> $data    object on normalize / array on denormalize
     * @param string              $to      target class
     * @param array<mixed>        $context context
     */
    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return
            Index::class === $to
            && OperationType::ITEM === ($context['operation_type'] ?? '')
            && InstallIndexInput::class === ($context['input']['class'] ?? '')
            && $context[AbstractNormalizer::OBJECT_TO_POPULATE] instanceof Index;
    }

    /**
     * @param InstallIndexInput $object  input object
     * @param string            $to      target class
     * @param array<mixed>      $context context
     *
     * @throws InvalidArgumentException
     *
     * @return object
     */
    public function transform($object, string $to, array $context = [])
    {
        $index = $context[AbstractNormalizer::OBJECT_TO_POPULATE];

        $this->indexOperation->installIndexByName($index->getName());

        return $index;
    }
}
