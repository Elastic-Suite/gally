<?php

namespace Elasticsuite\Example\Serializer;

use Elasticsuite\Example\Model\ExampleProduct;
use Elasticsuite\Example\Model\TextAttribute;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class AttributesDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED_DENORMALIZER = 'AttributesDenormalizerCalled';

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        $alreadyCalled = $context[self::ALREADY_CALLED_DENORMALIZER] ?? false;
        return $type === ExampleProduct::class && !$alreadyCalled;
    }

    /**
     * {@inheritdoc}
     */
    public function denormalize($data, string $type, string $format = null, array $context = []): mixed
    {
        $context[self::ALREADY_CALLED_DENORMALIZER] = true;

        /** @var ExampleProduct $esProduct */
        $esProduct = $this->denormalizer->denormalize($data, $type, $format, $context);

        if (isset($data['_source'])) {
            foreach ($data['_source'] as $attributeCode => $value) {
                if (!in_array($attributeCode, ExampleProduct::DEFAULT_ATTRIBUTE) && !is_array($value)) {
                    $esProduct->addAttribute(
                        new TextAttribute($attributeCode, $value)
                    );
                }
            }
        }

        return $esProduct;
    }
}
