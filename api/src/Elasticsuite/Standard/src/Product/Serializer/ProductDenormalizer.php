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

namespace Elasticsuite\Product\Serializer;

use Elasticsuite\Entity\Decoration\GraphQl\Type\StitchingFieldsBuilder;
use Elasticsuite\Entity\Model\Attribute\StructuredAttributeInterface;
use Elasticsuite\Entity\Model\Attribute\Type\NestedAttribute;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\Product\Model\Product;
use Elasticsuite\Search\Model\Document;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class ProductDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED_DENORMALIZER = 'ProductDenormalizerCalled';

    public function __construct(private MetadataRepository $metadataRepository, )
    {
    }

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        $alreadyCalled = $context[self::ALREADY_CALLED_DENORMALIZER] ?? false;

        return Product::class === $type && !$alreadyCalled;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize($data, string $type, string $format = null, array $context = []): mixed
    {
        $context[self::ALREADY_CALLED_DENORMALIZER] = true;

        $product = null;

        if ($data instanceof Product) {
            $product = $data;
        } else {
            if ($data instanceof Document) {
                $data = $data->getData();
            }
            $product = new Product($data);

            $contextAttributes = array_diff_key($context['attributes'] ?? [], array_fill_keys(Product::DEFAULT_ATTRIBUTES, true));
            if (!empty($contextAttributes) && isset($data['_source'])) {
                if ($productMetadata = $this->metadataRepository->findOneBy(['entity' => 'product'])) {
                    /*
                     * TODO : either a hard global (all source fields) cache existing between calls
                     *        OR a hard per-request (context attributes only) cache existing between calls
                     */
                    $sourceFieldsTypes = [];
                    /** @var SourceField $sourceField */
                    foreach ($productMetadata->getSourceFields() as $sourceField) {
                        $sourceFieldCode = $sourceField->getCode();
                        if (!\in_array($sourceField->getType(), array_keys(StitchingFieldsBuilder::STITCHING_ATTRIBUTE_CLASS_TYPE), true)) {
                            continue;
                        }
                        if ($sourceField->isNested()) {
                            [$path, $field] = [$sourceField->getNestedPath(), $sourceField->getNestedCode()];
                            $sourceFieldsTypes[$path][$field] = StitchingFieldsBuilder::STITCHING_ATTRIBUTE_CLASS_TYPE[$sourceField->getType()];
                        } else {
                            $sourceFieldsTypes[$sourceFieldCode] = StitchingFieldsBuilder::STITCHING_ATTRIBUTE_CLASS_TYPE[$sourceField->getType()];
                        }
                    }

                    // Looping on context|attributes instead to only parse requested attributes/fields.
                    foreach ($contextAttributes as $attributeCode => $subStructure) {
                        if (\array_key_exists($attributeCode, $sourceFieldsTypes) && \array_key_exists($attributeCode, $data['_source'])) {
                            $attributeType = $sourceFieldsTypes[$attributeCode];
                            $attributeValue = $data['_source'][$attributeCode];
                            if (\is_array($subStructure)) {
                                if (\is_array($sourceFieldsTypes[$attributeCode])) {
                                    // Individual nested fields.
                                    $subStructureKeys = array_keys($subStructure);
                                    $product->addAttribute(
                                        new NestedAttribute($attributeCode, $attributeValue, $subStructureKeys)
                                    );
                                } elseif (is_subclass_of($attributeType, StructuredAttributeInterface::class)) {
                                    // Structured/Complex fields, value is transmitted as is.
                                    $product->addAttribute(
                                        new $attributeType($attributeCode, $attributeValue) // @phpstan-ignore-line
                                    );
                                } else {
                                    if (\is_array($attributeValue)) {
                                        $attributeValue = json_encode($attributeValue);
                                    }
                                    $product->addAttribute(
                                        new $attributeType($attributeCode, $attributeValue)
                                    );
                                }
                            } else {
                                if (\is_array($attributeValue)) {
                                    $attributeValue = json_encode($attributeValue);
                                }
                                $product->addAttribute(
                                    new $attributeType($attributeCode, $attributeValue)
                                );
                            }
                        }
                    }
                }
            }
        }

        return $product;
    }
}
