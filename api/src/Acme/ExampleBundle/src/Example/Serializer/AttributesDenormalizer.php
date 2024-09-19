<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Acme\Example
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Acme\Example\Example\Serializer;

use Acme\Example\Example\Model\ExampleProduct;
use Gally\Metadata\Entity\Attribute\Type\TextAttribute;
use Symfony\Component\Serializer\Normalizer\ContextAwareDenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

class AttributesDenormalizer implements ContextAwareDenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    private const ALREADY_CALLED_DENORMALIZER = 'ProductAttributesDenormalizerCalled';

    /**
     * {@inheritdoc}
     */
    public function supportsDenormalization($data, string $type, string $format = null, array $context = []): bool
    {
        $alreadyCalled = $context[self::ALREADY_CALLED_DENORMALIZER] ?? false;

        return ExampleProduct::class === $type && !$alreadyCalled;
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
                if (!\in_array($attributeCode, ExampleProduct::DEFAULT_ATTRIBUTE, true)) {
                    if (\is_array($value)) {
                        $value = json_encode($value);
                    }
                    $esProduct->addAttribute(
                        new TextAttribute($attributeCode, $value)
                    );
                }
            }
        }

        return $esProduct;
    }
}
