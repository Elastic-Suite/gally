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

use Elasticsuite\Entity\Model\Attribute\GraphQlAttributeInterface;
use GraphQL\Type\Definition\Type as GraphQLType;

/**
 * Used for normalization/de-normalization and graphql schema stitching of scalar int source fields.
 * Also used for graphql schema stitching of nested int source fields.
 */
class IntAttribute extends AbstractAttribute implements GraphQlAttributeInterface
{
    private bool $extraSanitization = false;

    /**
     * {@inheritDoc}
     */
    public static function getGraphQlType(): GraphQLType
    {
        return GraphQLType::int();
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

            if ($this->extraSanitization && !\is_int($value)) {
                $value = (int) $value;
            }
        }

        return $value;
    }
}
