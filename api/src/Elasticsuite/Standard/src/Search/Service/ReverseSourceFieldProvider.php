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

namespace Elasticsuite\Search\Service;

use Elasticsuite\Metadata\Model\Metadata;
use Elasticsuite\Metadata\Model\SourceField;
use Elasticsuite\Metadata\Repository\SourceFieldRepository;

class ReverseSourceFieldProvider
{
    private array $sourceFieldByField = [];

    public function __construct(
        private SourceFieldRepository $sourceFieldRepository,
        private string $nestingSeparator
    ) {
    }

    public function getSourceFieldFromFieldName(string $fieldName, Metadata $metadata): ?SourceField
    {
        $fieldName = str_replace($this->nestingSeparator, '.', $fieldName);
        if (!\array_key_exists($fieldName, $this->sourceFieldByField)) {
            $this->sourceFieldByField[$fieldName] = $this->sourceFieldRepository->findOneBy(
                ['code' => [$fieldName, explode('.', $fieldName)[0]], 'metadata' => $metadata]
            );
        }

        return $this->sourceFieldByField[$fieldName];
    }
}
