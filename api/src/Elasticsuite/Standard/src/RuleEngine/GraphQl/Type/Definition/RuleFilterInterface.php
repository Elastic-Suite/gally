<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Smile ElasticSuite to newer
 * versions in the future.
 *
 * @package   Elasticsuite
 * @author    ElasticSuite Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Elasticsuite\RuleEngine\GraphQl\Type\Definition;

use Elasticsuite\Metadata\Model\SourceField;

interface RuleFilterInterface
{
    /**
     * Get GraphQl filter as array.
     */
    public function getGraphQlFilterAsArray(SourceField $sourceField, array $fields): array;

    /**
     * Validate type of the value(is_string ?, is_array ?, ...).
     */
    public function validateValueType(string $field, string $operator, mixed $value): void;
}
