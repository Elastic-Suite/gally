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

namespace Elasticsuite\Entity\Decoration\GraphQl\Type;

use ApiPlatform\Core\GraphQl\Type\FieldsBuilderInterface;
use ApiPlatform\Core\GraphQl\Type\TypesContainerInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Core\Metadata\Resource\ResourceMetadata;
use Elasticsuite\Entity\Model\Attribute\GraphQlAttributeInterface;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Model\SourceField\Type as SourceFieldType;
use Elasticsuite\Metadata\Repository\MetadataRepository;
use Elasticsuite\ResourceMetadata\Service\ResourceMetadataManager;
use GraphQL\Type\Definition\ObjectType;

/**
 * Allows to add dynamically attributes to an entity on GraphQL documentation.
 *
 * @todo: This is a first version of the stitching, this feature would be finalized when we will know how to manage attributes on entities.
 */
class StitchingFieldsBuilder implements FieldsBuilderInterface
{
    /**
     * @Todo: Move STITCHING_ATTRIBUTE_CLASS_TYPE to config.
     */
    public const STITCHING_ATTRIBUTE_CLASS_TYPE = [
        SourceFieldType::TYPE_TEXT => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_SELECT => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_INT => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_FLOAT => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_PRICE => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_REFERENCE => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_IMAGE => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
        SourceFieldType::TYPE_OBJECT => 'Elasticsuite\Entity\Model\Attribute\Type\TextAttribute',
    ];

    public function __construct(
        private MetadataRepository $metadataRepository,
        private ResourceMetadataFactoryInterface $resourceMetadataFactory,
        private ResourceMetadataManager $resourceMetadataManager,
        private TypesContainerInterface $typesContainer,
        private FieldsBuilderInterface $decorated,
    ) {
    }

    /**
     * {@inheritdoc}
     */
    public function getResourceObjectTypeFields(
        ?string $resourceClass,
        ResourceMetadata $resourceMetadata,
        bool $input,
        ?string $queryName,
        ?string $mutationName,
        ?string $subscriptionName,
        int $depth,
        ?array $ioMetadata
    ): array {
        $fields = $this->decorated->getResourceObjectTypeFields(
            $resourceClass, $resourceMetadata, $input, $queryName, $mutationName, $subscriptionName, $depth, $ioMetadata
        );

        $resourceMetadata = $this->resourceMetadataFactory->create($resourceClass);
        $metadataEntity = $this->resourceMetadataManager->getMetadataEntity($resourceMetadata);
        $stitchingProperty = $this->resourceMetadataManager->getStitchingProperty($resourceMetadata);

        /*
         * All these tests have been get from the "decorated" function (\ApiPlatform\Core\GraphQl\Type\FieldsBuilder::getResourceObjectTypeFields),
         * if one of these tests is true we don't make the stitching because it's not necessary.
         *
         */
        if ((null !== $ioMetadata && \array_key_exists('class', $ioMetadata) && null === $ioMetadata['class'])
            || (null !== $subscriptionName && $input)
            || ('delete' === $mutationName)
            || (null === $metadataEntity || null === $stitchingProperty) // Check if we have necessary ApiResource data to make the stitching.
        ) {
            return $fields;
        }

        $metadata = $this->metadataRepository->findOneBy(['entity' => $metadataEntity]);

        unset($fields[$stitchingProperty]);
        $nonScalarFields = [];
        /** @var SourceField $sourceField */
        foreach ($metadata->getSourceFields() as $sourceField) {
            if (!isset($fields[$sourceField->getName()])) {
                /** @var GraphQlAttributeInterface|string|null $attributeClassType */
                $attributeClassType = self::STITCHING_ATTRIBUTE_CLASS_TYPE[$sourceField->getType()] ?? null;

                if (null === $attributeClassType || !is_subclass_of($attributeClassType, GraphQlAttributeInterface::class)) {
                    throw new \LogicException(sprintf("The class '%s' doesn't implement the interface '%s'", $attributeClassType, GraphQlAttributeInterface::class));
                }

                if (false === str_contains($sourceField->getName(), '.')) {
                    $fields[$sourceField->getName()] = $this->getField($attributeClassType);
                } else {
                    // There are max two levels.
                    // 'stock.qty' become $nonScalarFields['stock']['qty'].
                    $attributeHierarchy = explode('.', $sourceField->getName());
                    $nonScalarFields[$attributeHierarchy[0]][$attributeHierarchy[1]]['source_field'] = $sourceField;
                    $nonScalarFields[$attributeHierarchy[0]][$attributeHierarchy[1]]['class_type'] = $attributeClassType;
                }
            }
        }

        return $this->processNonScalarFields($nonScalarFields, $fields);
    }

    public function processNonScalarFields(array $nonScalarFields, array $fields): array
    {
        // This part has been inspired by the function \ApiPlatform\Core\GraphQl\Type\TypeBuilder::getResourceObjectType.
        foreach ($nonScalarFields as $parent => $children) {
            $shortName = ucfirst($parent) . 'Attribute';
            if ($this->typesContainer->has($shortName)) {
                $objectType = $this->typesContainer->get($shortName);
            } else {
                $configuration = [
                    'name' => $shortName,
                    'description' => ucfirst($parent) . ' attribute.',
                    'interfaces' => [],
                ];

                foreach ($children as $childName => $child) {
                    $configuration['fields'][$childName] = $this->getField($child['class_type']);
                }
                $objectType = new ObjectType($configuration);
                $this->typesContainer->set($shortName, $objectType);
            }

            $fields[$parent] = [
                'type' => $objectType,
                'description' => null,
                'args' => [],
                'resolve' => null,
                'deprecationReason' => null,
            ];
        }

        return $fields;
    }

    public function getField(
        string $attributeClassType,
        ?string $description = null,
        array $args = [],
        ?callable $resolve = null,
        ?string $deprecationReason = null
    ): array {
        // This part has been inspired by the function \ApiPlatform\Core\GraphQl\Type\FieldsBuilder::getResourceFieldConfiguration.
        /** @var GraphQlAttributeInterface $attributeClassType */
        return [
            'type' => $attributeClassType::getGraphQlType(),
            'description' => $description,
            'args' => $args,
            'resolve' => $resolve,
            'deprecationReason' => $deprecationReason,
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function getNodeQueryFields(): array
    {
        return $this->decorated->getNodeQueryFields();
    }

    /**
     * {@inheritdoc}
     */
    public function getItemQueryFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $queryName,
        array $configuration
    ): array {
        return $this->decorated->getItemQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);
    }

    /**
     * {@inheritdoc}
     */
    public function getCollectionQueryFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $queryName,
        array $configuration
    ): array {
        return $this->decorated->getCollectionQueryFields($resourceClass, $resourceMetadata, $queryName, $configuration);
    }

    /**
     * {@inheritdoc}
     */
    public function getMutationFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $mutationName
    ): array {
        return $this->decorated->getMutationFields($resourceClass, $resourceMetadata, $mutationName);
    }

    /**
     * {@inheritdoc}
     */
    public function getSubscriptionFields(
        string $resourceClass,
        ResourceMetadata $resourceMetadata,
        string $subscriptionName
    ): array {
        return $this->decorated->getSubscriptionFields($resourceClass, $resourceMetadata, $subscriptionName);
    }

    /**
     * {@inheritdoc}
     */
    public function resolveResourceArgs(array $args, string $operationName, string $shortName): array
    {
        return $this->decorated->resolveResourceArgs($args, $operationName, $shortName);
    }
}
