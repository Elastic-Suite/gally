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

namespace Elasticsuite\Search\Elasticsearch\Builder\Request\Query\Fulltext;

use Elasticsuite\Index\Model\Index\Mapping\FieldFilterInterface;
use Elasticsuite\Index\Model\Index\Mapping\FieldInterface;

/**
 * Indicates if a field is used in fulltext search.
 */
class SearchableFieldFilter implements FieldFilterInterface
{
    /**
     * {@inheritDoc}
     */
    public function filterField(FieldInterface $field): bool
    {
        return FieldInterface::FIELD_TYPE_TEXT == $field->getType()
            && $field->isSearchable()
            && false === $field->isNested();
    }
}
