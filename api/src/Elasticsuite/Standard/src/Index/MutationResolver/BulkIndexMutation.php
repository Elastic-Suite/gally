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

namespace Elasticsuite\Index\MutationResolver;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Elasticsuite\Index\Dto\Bulk;
use Elasticsuite\Index\Model\Index;
use Elasticsuite\Index\Repository\Index\IndexRepositoryInterface;

class BulkIndexMutation implements MutationResolverInterface
{
    public function __construct(private IndexRepositoryInterface $indexRepository)
    {
    }

    /**
     * @param Index|null $item
     *
     * @return Index
     */
    public function __invoke($item, array $context)
    {
        $indexName = $context['args']['input']['indexName'];
        $index = $this->indexRepository->findByName($indexName);
        if (!$index) {
            throw new InvalidArgumentException(sprintf('Index with name [%s] does not exist', $indexName));
        }

        $request = new Bulk\Request();
        $request->addDocuments($index, json_decode($context['args']['input']['data'], true) ?? []);

        if ($request->isEmpty()) {
            throw new InvalidArgumentException('Can not execute empty bulk.');
        }

        $response = $this->indexRepository->bulk($index, $request);
        if ($response->hasErrors()) {
            $errorMessages = [];
            foreach ($response->aggregateErrorsByReason() as $error) {
                $sampleDocumentIds = implode(', ', \array_slice($error['document_ids'], 0, 10));
                $errorMessages[] = sprintf(
                    'Bulk %s operation failed %d times in index %s.',
                    $error['operation'],
                    $error['count'],
                    $error['index']
                );
                $errorMessages[] = sprintf('Error (%s) : %s.', $error['error']['type'], $error['error']['reason']);
                $errorMessages[] = sprintf('Failed doc ids sample : %s.', $sampleDocumentIds);
            }
            if (!empty($errorMessages)) {
                throw new InvalidArgumentException(implode(' ', $errorMessages));
            }
        }

        return $index;
    }
}
