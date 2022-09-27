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

namespace Elasticsuite\Entity\Model\Attribute\Type;

use Elasticsuite\Entity\Model\Attribute\AttributeInterface;

/**
 * Used for normalization/de-normalization only of nested fields.
 */
class NestedAttribute implements AttributeInterface
{
    protected string $attributeCode;

    protected mixed $value;

    /** @var string[] */
    protected array $fields;

    public function __construct($attributeCode, $value, array $fields)
    {
        $this->attributeCode = $attributeCode;
        $this->value = $value;
        $this->fields = $fields;
    }

    /**
     * {@inheritDoc}
     */
    public function getAttributeCode(): string
    {
        return $this->attributeCode;
    }

    /**
     * {@inheritDoc}
     */
    public function getValue(): mixed
    {
        if (\is_array($this->value)) {
            // TODO : iterate on elements and intersect keys with $this->fields ?
            $value = $this->value;
            $hasSingleEntry = \count(array_intersect(array_keys($this->value), $this->fields)) > 0;
            if (!$hasSingleEntry) {
                $value = current($this->value);
            }

            return $value;
        }

        // TODO return [$this->value] ?
        return $this->value;
    }
}
