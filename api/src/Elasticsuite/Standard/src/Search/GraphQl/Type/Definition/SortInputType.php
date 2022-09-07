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

namespace Elasticsuite\Search\GraphQl\Type\Definition;

use ApiPlatform\Core\GraphQl\Type\Definition\TypeInterface;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\Type as GraphQLType;

class SortInputType extends InputObjectType implements TypeInterface
{
    public const NAME = 'SortInput';

    public function __construct(private TypesContainerInterface $typesContainer)
    {
        $this->name = self::NAME;

        parent::__construct($this->getConfig());
    }

    public function getConfig(): array
    {
        return [
            'fields' => [
                'field' => Type::nonNull(Type::string()),
                'direction' => $this->getSortEnumType(),
            ],
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getName(): string
    {
        return $this->name;
    }

    protected function getSortEnumType(): GraphQLType
    {
        $sortEnumType = $this->typesContainer->has(SortEnumType::NAME) // @phpstan-ignore-line
            ? $this->typesContainer->get(SortEnumType::NAME)
            : new SortEnumType();
        $this->typesContainer->set(SortEnumType::NAME, $sortEnumType);

        return $sortEnumType;
    }
}
