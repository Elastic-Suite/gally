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

namespace Gally\Search\Elasticsearch\Builder\Request\Query\Fulltext;

use Gally\Index\Model\Index\Mapping\FieldInterface;

/**
 * Indicates if a field is used in fuzzy search.
 */
class FuzzyFieldFilter extends SearchableFieldFilter
{
    /**
     * {@inheritDoc}
     */
    public function filterField(FieldInterface $field): bool
    {
        return parent::filterField($field) && $field->isUsedInSpellcheck();
    }
}
