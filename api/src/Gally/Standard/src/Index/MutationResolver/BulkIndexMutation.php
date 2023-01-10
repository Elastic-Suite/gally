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

namespace Gally\Index\MutationResolver;

use ApiPlatform\Core\Exception\InvalidArgumentException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Gally\Index\Dto\Bulk;
use Gally\Index\Model\Index;
use Gally\Index\Repository\Index\IndexRepositoryInterface;

class BulkIndexMutation implements MutationResolverInterface
{
    public function __construct(protected IndexRepositoryInterface $indexRepository)
    {
    }

    /**
     * @param Index|null $item
     *
     * @return Index
     */
    public function __invoke($item, array $context)
    {
        $index = $this->getIndex($context);
        $request = new Bulk\Request();
        $request->addDocuments($index, json_decode($context['args']['input']['data'], true) ?? []);

        $this->runBulkQuery($index, $request);

        return $index;
    }

    protected function getIndex(array $context): Index
    {
        $indexName = $context['args']['input']['indexName'];
        $index = $this->indexRepository->findByName($indexName);
        if (!$index) {
            throw new InvalidArgumentException(sprintf('Index with name [%s] does not exist', $indexName));
        }

        return $index;
    }

    protected function runBulkQuery(Index $index, Bulk\Request $request): Bulk\Response
    {
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

        return $response;
    }
}
