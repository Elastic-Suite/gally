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

namespace Elasticsuite\Product\Service\GraphQl;

use Elasticsuite\Product\Service\CurrentCategoryProvider;
use Elasticsuite\Search\GraphQl\Type\Definition\FieldFilterInputType;

class FilterManager extends \Elasticsuite\Search\Service\GraphQl\FilterManager
{
    public function __construct(
        private FieldFilterInputType $fieldFilterInputType,
        private CurrentCategoryProvider $currentCategoryProvider,
    ) {
        parent::__construct($this->fieldFilterInputType);
    }

    public function getFiltersFromContext(array $context): array
    {
        $filters = parent::getFiltersFromContext($context);

        if (isset($context['filters']['currentCategoryId'])) {
            $filters[]['category__id'] = ['eq' => $context['filters']['currentCategoryId']];
            $this->currentCategoryProvider->setCurrentCategory($context['filters']['currentCategoryId']);
        }

        return $filters;
    }
}
