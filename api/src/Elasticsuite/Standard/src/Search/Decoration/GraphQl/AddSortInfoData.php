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

namespace Elasticsuite\Search\Decoration\GraphQl;

use ApiPlatform\Core\GraphQl\Resolver\Stage\SerializeStageInterface;
use Elasticsuite\Search\DataProvider\Paginator;
use Elasticsuite\Search\Model\Document;

class AddSortInfoData implements SerializeStageInterface
{
    public function __construct(
        private SerializeStageInterface $decorated,
    ) {
    }

    public function __invoke($itemOrCollection, string $resourceClass, string $operationName, array $context): ?array
    {
        $data = $this->decorated->__invoke($itemOrCollection, $resourceClass, $operationName, $context);

        if (Document::class === $resourceClass || is_subclass_of($resourceClass, Document::class)) {
            /** @var Paginator $itemOrCollection */
            $sortOrders = $itemOrCollection->getCurrentSortOrders();
            if (!empty($sortOrders)) {
                $data['sortInfo'] = ['current' => []];
                // TODO handle correctly or filter out \Elasticsuite\Search\Elasticsearch\Builder\Request\SortOrder\Script.
                foreach ($sortOrders as $sortOrder) {
                    $data['sortInfo']['current'][] = [
                        'field' => $sortOrder->getField(),
                        'direction' => $sortOrder->getDirection(),
                    ];
                    break;
                }
            }
        }

        return $data;
    }
}
