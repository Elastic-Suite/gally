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

use Elasticsuite\Entity\Model\Attribute\Type\TextAttribute;
use Elasticsuite\Product\Model\Product;
use Elasticsuite\Search\Model\Document;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class ProductDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED_DENORMALIZER = 'ProductDenormalizerCalled';

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

            if (isset($data['_source'])) {
                // TODO loop on context|attributes instead to only parse requested attributes/fields.
                foreach ($data['_source'] as $attributeCode => $value) {
                    if (!\in_array((string) $attributeCode, Product::DEFAULT_ATTRIBUTES, true)) {
                        if (\is_array($value)) {
                            $value = json_encode($value);
                        }
                        $product->addAttribute(
                            new TextAttribute($attributeCode, $value)
                        );
                    }
                }
            }
        }

        return $product;
    }
}
