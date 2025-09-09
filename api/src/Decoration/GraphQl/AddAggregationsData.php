<?php
/**
 * DISCLAIMER.
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace App\Search\Decoration\GraphQl;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\GraphQl\Type\Definition\Filter\DateTypeFilterInputType;
use Gally\Catalog\Repository\LocalizedCatalogRepository;
use Gally\Metadata\Repository\MetadataRepository;
use Gally\Search\Elasticsearch\Request\Container\Configuration\ContainerConfigurationProvider;
use Gally\Search\Entity\Document;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\Translation\TranslatorInterface;
use \Gally\Search\Decoration\GraphQl\AddAggregationsData as BaseAddAggregationsData;

/**
 * Add aggregations data in graphql search document response.
 */
class AddAggregationsData implements ProcessorInterface
{
    public const AGGREGATION_TYPE_DATE_RANGE = 'date_range';

    public function __construct(
        private ProcessorInterface $decorated,
        private MetadataRepository $metadataRepository,
        private ContainerConfigurationProvider $containerConfigurationProvider,
        private LocalizedCatalogRepository $localizedCatalogRepository,
        private TranslatorInterface $translator,
        private array $searchConfig,
    ) {
    }

    /**
     * @param array<string, mixed>&array{request?: Request, previous_data?: mixed, resource_class?: string, original_data?: mixed, args?: array} $context
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ?array
    {
        $result = $this->decorated->process($data, $operation, $uriVariables, $context);

        if (Document::class === $operation->getClass() || is_subclass_of($operation->getClass(), Document::class)) {
            $metadata = $this->metadataRepository->findByEntity($context['args']['entityType']);
            $localizedCatalog = $this->localizedCatalogRepository->findByCodeOrId($context['args']['localizedCatalog']);
            $containerConfig = $this->containerConfigurationProvider->get($metadata, $localizedCatalog, $context['args']['requestType'] ?? null);
            $ranges = [];
            foreach ($this->searchConfig['aggregations']['default_date_ranges'] as $range) {
                $ranges[$range['key']] = $range;
            }

            foreach ($result['aggregations'] ?? [] as $aggsKey => $aggregation) {
                if ($aggregation['type'] === BaseAddAggregationsData::AGGREGATION_TYPE_DATE_HISTOGRAM) {
                    $aggregation['type'] = self::AGGREGATION_TYPE_DATE_RANGE;
                    foreach ($aggregation['options'] as $key => $option) {
                        if (array_key_exists($option['value'], $ranges)) {
                            $aggregation['options'][$key]['label'] = $this->translator->trans(
                                $ranges[$option['value']]['label'],
                                [],
                                'messages',
                                $containerConfig->getLocalizedCatalog()->getLocale()
                            );
                            $aggregation['options'][$key]['value'] = ($ranges[$option['value']]['from'] ?? '*')
                                . DateTypeFilterInputType::DATE_RANGE_SEPARATOR
                                . ($ranges[$option['value']]['to'] ?? '*');
                        }
                    }
                    $result['aggregations'][$aggsKey] = $aggregation;
                }
            }
        }

        return $result;
    }
}
