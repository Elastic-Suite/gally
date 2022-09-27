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

namespace Elasticsuite\Entity\Serializer\GraphQl;

use ApiPlatform\Core\GraphQl\Serializer\ItemNormalizer;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\ResourceMetadata\Service\ResourceMetadataManager;
use Symfony\Component\Serializer\Normalizer\ContextAwareNormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;

/**
 * Allows to add in the GraphQL response the value of the attributes added dynamically on GraphQL documentation.
 */
class StitchingNormalizer implements ContextAwareNormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED_NORMALIZER = 'GraphQlProductAttributesNormalizerCalled';

    public function __construct(
        private MetadataRepository $metadataRepository,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ResourceMetadataManager $resourceMetadataManager,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization(mixed $data, string $format = null, array $context = []): bool
    {
        $alreadyCalled = $context[self::ALREADY_CALLED_NORMALIZER] ?? false;
        if (ItemNormalizer::FORMAT !== $format || $alreadyCalled) {
            return false;
        }

        $stitchingProperty = null;
        if (\is_object($data)) {
            $resourceMetadata = $this->resourceMetadataFactory->create($data::class);
            $stitchingProperty = $this->resourceMetadataManager->getStitchingProperty($resourceMetadata);
        }

        return null !== $stitchingProperty;
    }

    /**
     * {@inheritdoc}
     */
    public function normalize(mixed $object, string $format = null, array $context = [])
    {
        $context[self::ALREADY_CALLED_NORMALIZER] = true;
        $data = $this->normalizer->normalize($object, $format, $context);

        $resourceMetadata = $this->resourceMetadataFactory->create($object::class);
        $metadataEntity = $this->resourceMetadataManager->getMetadataEntity($resourceMetadata);
        $stitchingProperty = $this->resourceMetadataManager->getStitchingProperty($resourceMetadata);

        $sourceFieldNames = [];
        $productMetadata = $this->metadataRepository->findOneBy(['entity' => $metadataEntity]);
        /*
         * TODO : either a hard global (all source fields) cache existing between calls
         *        OR a hard per-request (context attributes only) cache existing between calls
         */
        /** @var SourceField $sourceField */
        foreach ($productMetadata->getSourceFields() as $sourceField) {
            if (true === $sourceField->isNested()) {
                // 'stock.qty' become $sourceFieldNames = ['stock' => [0 => 'qty']].
                [$path, $code] = [$sourceField->getNestedPath(), $sourceField->getNestedCode()];
                $sourceFieldNames[$path][] = $code;
            }
            $sourceFieldNames[$sourceField->getCode()] = true;
        }

        /*
         * No need to loop here on context|attributes here if the entity-specific de-normalizer already did
         * when hydrating the object.
         */
        foreach ($object->{$stitchingProperty} as $attribute) {
            if (isset($sourceFieldNames[$attribute->getAttributeCode()])) {
                if (\is_array($sourceFieldNames[$attribute->getAttributeCode()])) {
                    $value = null !== $attribute->getValue() ? $attribute->getValue() : '';
                    if (\is_string($value)) {
                        $values = json_decode($value, true);
                        foreach ($sourceFieldNames[$attribute->getAttributeCode()] as $subAttribute) {
                            $data[$attribute->getAttributeCode()][$subAttribute] = $values[$subAttribute] ?? null;
                        }
                    } else {
                        $data[$attribute->getAttributeCode()] = $attribute->getValue();
                    }
                } else {
                    $data[$attribute->getAttributeCode()] = $attribute->getValue();
                }
            }
        }

        return $data;
    }
}
