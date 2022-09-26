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
