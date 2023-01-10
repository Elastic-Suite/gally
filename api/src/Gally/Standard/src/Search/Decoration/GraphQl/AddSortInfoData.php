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

namespace Gally\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Resolver\Stage\SerializeStageInterface;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\DataProvider\Paginator;
use Gally\Search\Model\Document;
use Gally\Search\Service\ReverseSourceFieldProvider;

class AddSortInfoData implements SerializeStageInterface
{
    public function __construct(
        private iterable $sortOrderProviders,
        private ReverseSourceFieldProvider $reverseSourceFieldProvider,
        private MetadataRepository $metadataRepository,
        private SerializeStageInterface $decorated
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        $data = $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);

        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            $metadata = $this->metadataRepository->findByEntity($context['args']['entityType']);
            /** @var Paginator $itemOrCollection */
            $sortOrders = $itemOrCollection->getCurrentSortOrders();
            if (!empty($sortOrders)) {
                $data['sortInfo'] = ['current' => []];
                // TODO handle correctly or filter out \Gally\Search\Elasticsearch\Builder\Request\SortOrder\Script.
                foreach ($sortOrders as $sortOrder) {
                    $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($sortOrder->getField(), $metadata);
                    if ($sourceField) {
                        $fieldName = $sourceField->getCode();
                        foreach ($this->sortOrderProviders as $sortOrderProvider) {
                            if ($sortOrderProvider->supports($sourceField)) {
                                $fieldName = $sortOrderProvider->getSortOrderField($sourceField);
                            }
                        }
                    } else {
                        $fieldName = $sortOrder->getField();
                    }

                    $data['sortInfo']['current'][] = ['field' => $fieldName, 'direction' => $sortOrder->getDirection()];
                    break;
                }
            }
        }

        return $data;
    }
}
