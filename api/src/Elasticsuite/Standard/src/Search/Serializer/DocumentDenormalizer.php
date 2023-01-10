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

namespace Elasticsuite\Search\Serializer;

use Elasticsuite\Search\Elasticsearch\DocumentInterface;
use Elasticsuite\Search\Model\Document;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class DocumentDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED_DENORMALIZER = 'SearchDenormalizerCalled';

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        $alreadyCalled = $context[self::ALREADY_CALLED_DENORMALIZER] ?? false;

        return Document::class === $type && !$alreadyCalled;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize($data, string $type, string $format = null, array $context = []): mixed
    {
        $context[self::ALREADY_CALLED_DENORMALIZER] = true;

        if ($data instanceof DocumentInterface) {
            return $data;
        }

        return new Document($data);
    }
}
