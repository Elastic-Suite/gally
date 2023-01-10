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

namespace Gally\Metadata\EventSubscriber;

use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Gally\Exception\LogicException;
use Gally\Metadata\Model\SourceField;
use Gally\Metadata\Repository\SourceFieldRepository;

class ValidateSourceFieldCode implements EventSubscriberInterface
{
    public function __construct(
        private SourceFieldRepository $sourceFieldRepository,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->validateSourceFieldCode($args, 'create');
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->validateSourceFieldCode($args, 'update');
    }

    private function validateSourceFieldCode(LifecycleEventArgs $args, string $action): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof SourceField) {
            return;
        }
        $sourceField = $entity;
        $metadata = $sourceField->getMetadata();

        /*
         * Allows to avoid code conflicts between scalar and structured source fields.
         * For example with these validations we can't create a source field 'category' and 'category.id' and vice versa.
         */
        if ($sourceField->isNested()) {
            $sourceFields = $this->sourceFieldRepository->findBy([
                'code' => $sourceField->getNestedPath(),
                'metadata' => $metadata,
            ]);

            if (\count($sourceFields) > 0) {
                throw new LogicException("You can't $action a source field with the code '{$sourceField->getCode()}' because a source field with the code '{$sourceField->getNestedPath()}' exists.");
            }
        } else {
            $sourceFields = $this->sourceFieldRepository->findByCodePrefix($sourceField->getCode() . '.', $metadata);

            if (\count($sourceFields) > 0) {
                throw new LogicException("You can't $action a source field with the code '{$sourceField->getCode()}' because a source field with the code '{$sourceField->getCode()}.*' exists.");
            }
        }
    }
}
