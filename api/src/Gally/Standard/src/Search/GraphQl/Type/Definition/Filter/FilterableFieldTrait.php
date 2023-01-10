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

namespace Gally\Search\GraphQl\Type\Definition\Filter;

use Gally\Metadata\Model\SourceField;
use Gally\Search\Elasticsearch\Request\ContainerConfigurationInterface;
use Gally\Search\Service\ReverseSourceFieldProvider;

trait FilterableFieldTrait
{
    /**
     * @var array<string, boolean>
     */
    private array $sourceFieldsValidated;

    private ReverseSourceFieldProvider $reverseSourceFieldProvider;

    public function validateIsFilterable(string $fieldName, ContainerConfigurationInterface $containerConfig): array
    {
        if (isset($this->sourceFieldsValidated[$fieldName])) {
            return [];
        }

        $errors = [];
        $sourceField = $this->reverseSourceFieldProvider->getSourceFieldFromFieldName($fieldName, $containerConfig->getMetadata());

        /*
         * For the MVP we check only if the source field exists.
         * We can't check if the source field is_filterable or is_used_for_rules,
         * because the sku would not filterable via the API for example.
         */
        if (!$sourceField instanceof SourceField) {
            $errors[] = "The field '{$fieldName}' does not exist";
        }

        $this->sourceFieldsValidated[$fieldName] = true;

        return $errors;
    }
}
