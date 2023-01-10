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

namespace Elasticsuite\Entity\Model\Attribute\Type;

use Elasticsuite\Entity\Model\Attribute\GraphQlAttributeInterface;
use GraphQL\Type\Definition\Type as GraphQLType;

/**
 * Used for normalization/de-normalization and graphql schema stitching of scalar boolean source fields.
 * Also used for graphql schema stitching of nested boolean source fields.
 */
class BooleanAttribute extends AbstractAttribute implements GraphQlAttributeInterface
{
    public const ATTRIBUTE_TYPE = 'boolean';

    private bool $extraSanitization = false;

    /**
     * {@inheritDoc}
     */
    public static function getGraphQlType(): GraphQLType
    {
        return GraphQLType::boolean();
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

            if ($this->extraSanitization && !\is_bool($value)) {
                $value = (bool) $value;
            }
        }

        return $value;
    }
}
