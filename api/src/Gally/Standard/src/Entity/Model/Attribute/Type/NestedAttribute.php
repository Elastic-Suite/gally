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

namespace Gally\Entity\Model\Attribute\Type;

/**
 * Used for normalization/de-normalization only of nested fields.
 */
class NestedAttribute extends AbstractAttribute
{
    public const ATTRIBUTE_TYPE = 'nested';

    /** @var string[] */
    protected array $fields;

    public function __construct($attributeCode, $value, array $fields)
    {
        // TODO throw exception if fields list is empty ?
        $this->fields = $fields;
        parent::__construct($attributeCode, $value);
    }

    /**
     * {@inheritDoc}
     */
    protected function getSanitizedData(mixed $value): mixed
    {
        if (\is_array($value) && !empty($value)) {
            // TODO : iterate on elements and intersect keys with $this->fields ?
            $hasSingleEntry = \count(array_intersect(array_keys($value), $this->fields)) > 0;
            // TODO add an extra check to make sure value is an array of arrays ?
            if (!$hasSingleEntry) {
                $value = current($value);
            }

            return $value;
        }

        return $value;
    }
}
