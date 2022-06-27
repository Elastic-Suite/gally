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

class FloatAttribute implements AttributeInterface, GraphQlAttributeInterface
{
    protected string $attributeCode;

    protected mixed $value;

    public function __construct($attributeCode, $value)
    {
        $this->attributeCode = $attributeCode;
        $this->value = $value;
    }

    public function getAttributeCode(): string
    {
        return $this->attributeCode;
    }

    public function getValue(): mixed
    {
        return $this->value;
    }

    public static function getGraphQlType(): mixed
    {
        return GraphQLType::float();
    }
}
