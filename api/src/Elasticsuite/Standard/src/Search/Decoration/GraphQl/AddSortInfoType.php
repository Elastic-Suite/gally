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

namespace Elasticsuite\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Type\TypeBuilderInterface;
use ApiPlatform\Core\GraphQl\Type\TypeNotFoundException;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use Elasticsuite\Search\GraphQl\Type\Definition\SortOptionType;
use Elasticsuite\Search\Model\Document;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type as GraphQLType;
use Symfony\Component\PropertyInfo\Type;

class AddSortInfoType implements TypeBuilderInterface
{
    public function __construct(
        private TypesContainerInterface $typesContainer,
        private SortOptionType $sortOptionType,
        private TypeBuilderInterface $decorated,
    ) {
    }

    public function getResourcePaginatedCollectionType(GraphQLType $resourceType, string $resourceClass, string $operationName): GraphQLType
    {
        $type = $this->decorated->getResourcePaginatedCollectionType($resourceType, $resourceClass, $operationName);
        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $fields = $type->getFields(); // @phpstan-ignore-line
            $fields['sortInfo'] = $this->getSortingInfoType($resourceType);
            $configuration = [
                'name' => $type->name,
                'description' => "Connection for {$type->name}.",
                'fields' => $fields,
            ];

            $type = new ObjectType($configuration);
            $this->typesContainer->set($type->name, $type);
        }

        return $type;
    }

    public function getResourceObjectType(?string $resourceClass, ResourceMetadata $resourceMetadata, bool $input, ?string $queryName, ?string $mutationName, ?string $subscriptionName, bool $wrapped, int $depth): GraphQLType
    {
        return $this->decorated->getResourceObjectType($resourceClass, $resourceMetadata, $input, $queryName, $mutationName, $subscriptionName, $wrapped, $depth);
    }

    public function getNodeInterface(): InterfaceType
    {
        return $this->decorated->getNodeInterface();
    }

    public function isCollection(Type $type): bool
    {
        return $this->decorated->isCollection($type);
    }

    private function getSortingInfoType(GraphQLType $resourceType): GraphQLType
    {
        try {
            $sortInfoType = $this->typesContainer->get('sortInfo'); // @phpstan-ignore-line
        } catch (TypeNotFoundException) {
            $sortInfoType = new ObjectType(
                [
                    'name' => 'sortInfo',
                    'fields' => [
                        'current' => GraphQLType::listOf($this->sortOptionType),
                    ],
                ]
            );
            $this->typesContainer->set('sortInfo', $sortInfoType);
        }

        return GraphQLType::nonNull($sortInfoType);
    }
}
