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

use Gally\Entity\Model\Attribute\GraphQlAttributeInterface;
use GraphQL\Type\Definition\Type as GraphQLType;

/**
 * Used for normalization/de-normalization and graphql schema stitching of scalar float source fields.
 * Also used for graphql schema stitching of nested float source fields.
 */
class FloatAttribute extends AbstractAttribute implements GraphQlAttributeInterface
{
    public const ATTRIBUTE_TYPE = 'float';

    private bool $extraSanitization = false;

    /**
     * {@inheritDoc}
     */
    public static function getGraphQlType(): GraphQLType
    {
        return GraphQLType::float();
    }

    /**
     * {@inheritDoc}
     */
    protected function getSanitizedData(mixed $value): mixed
    {
        if (null !== $value) {
            if (\is_array($value)) {
                $value = $this->getSanitizedData(current($value));
            }

            if ($this->extraSanitization && !\is_float($value)) {
                $value = (float) $value;
            }
        }

        return $value;
    }
}
