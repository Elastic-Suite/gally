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

namespace Elasticsuite\Index\Dto\Bulk;

/**
 * ES bulk response.
 */
class Response
{
    public function __construct(private array $rawResponse)
    {
    }

    /**
     * Check if the bulk has errors.
     */
    public function hasErrors(): bool
    {
        return (bool) $this->rawResponse['errors'];
    }

    /**
     * Get all items with an errors.
     */
    public function getErrorItems(): array
    {
        return array_filter($this->rawResponse['items'], function ($item) {
            return isset(current($item)['error']);
        });
    }

    /**
     * Get all successful items.
     */
    public function getSuccessItems(): array
    {
        return array_filter($this->rawResponse['items'], function ($item) {
            return !isset(current($item)['error']);
        });
    }

    /**
     * Count items with an error.
     */
    public function countErrors(): int
    {
        return \count($this->getErrorItems());
    }

    /**
     * Count successful items.
     */
    public function countSuccess(): int
    {
        return \count($this->getSuccessItems());
    }

    /**
     * Aggregate all errors by index, document_type, error type and reason.
     * Used to log errors in compact mode.
     */
    public function aggregateErrorsByReason(): array
    {
        $errorByReason = [];

        foreach ($this->getErrorItems() as $item) {
            $operationType = current(array_keys($item));
            $itemData = $item[$operationType];
            $index = $itemData['_index'];
            $errorData = $itemData['error'];
            $errorKey = $operationType . $errorData['type'] . $errorData['reason'] . $index;

            if (!isset($errorByReason[$errorKey])) {
                $errorByReason[$errorKey] = [
                    'index' => $itemData['_index'],
                    'operation' => $operationType,
                    'error' => ['type' => $errorData['type'], 'reason' => $errorData['reason']],
                    'count' => 0,
                ];
            }

            ++$errorByReason[$errorKey]['count'];
            $errorByReason[$errorKey]['document_ids'][] = $itemData['_id'];
        }

        return array_values($errorByReason);
    }
}
