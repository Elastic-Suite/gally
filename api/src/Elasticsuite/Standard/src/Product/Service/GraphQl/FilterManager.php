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

namespace Elasticsuite\Product\Service\GraphQl;

use Elasticsuite\Category\Service\CurrentCategoryProvider;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;

class FilterManager extends \Elasticsuite\Search\Service\GraphQl\FilterManager
{
    public function __construct(
        FieldFilterInputType $fieldFilterInputType,
        protected string $nestingSeparator,
        private CurrentCategoryProvider $currentCategoryProvider,
    ) {
        parent::__construct($fieldFilterInputType, $nestingSeparator);
    }

    public function getQueryFilterFromContext(array $context): array
    {
        $queryFilters = parent::getQueryFilterFromContext($context);

        if (isset($context['filters']['currentCategoryId'])) {
            $queryFilters[]['category__id'] = ['eq' => $context['filters']['currentCategoryId']];
            $this->currentCategoryProvider->setCurrentCategory($context['filters']['currentCategoryId']);
        }

        return $queryFilters;
    }
}
