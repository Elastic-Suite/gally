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

use ApiPlatform\Core\Api\OperationType;
use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use ApiPlatform\Core\Exception\InvalidArgumentException;
use Gally\Index\Dto\RefreshIndexInput;
use Gally\Index\Model\Index;
use Gally\Index\Repository\Index\IndexRepositoryInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class RefreshIndexDataTransformer implements DataTransformerInterface
{
    public function __construct(
        private IndexRepositoryInterface $indexRepository,
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
            && RefreshIndexInput::class === ($context['input']['class'] ?? '')
            && $context[AbstractNormalizer::OBJECT_TO_POPULATE] instanceof Index;
    }

    /**
     * @param RefreshIndexInput $object  input object
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

        $this->indexRepository->refresh($index->getName());

        return $index;
    }
}
