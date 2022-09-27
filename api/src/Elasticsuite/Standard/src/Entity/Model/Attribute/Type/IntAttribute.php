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
use Elasticsuite\Entity\Model\Attribute\GraphQlAttributeInterface;
use GraphQL\Type\Definition\Type as GraphQLType;

/**
 * Used for normalization/de-normalization and graphql schema stitching of scalar int source fields.
 * Also used for graphql schema stitching of nested int source fields.
 */
class IntAttribute implements AttributeInterface, GraphQlAttributeInterface
{
    protected string $attributeCode;

    protected mixed $value;

    public function __construct($attributeCode, $value)
    {
        $this->attributeCode = $attributeCode;
        $this->value = $value;
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
        return $this->value;
    }

    /**
     * {@inheritDoc}
     */
    public static function getGraphQlType(): mixed
    {
        return GraphQLType::int();
    }
}
