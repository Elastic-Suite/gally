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

namespace Gally\Search\Service;

use Gally\Metadata\Model\Metadata;
use Gally\Metadata\Model\SourceField;
use Gally\Metadata\Repository\SourceFieldRepository;

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
