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

namespace Elasticsuite\Entity\Service;

use Elasticsuite\RequestContext\Service\RequestContextManager;

class PriceGroupProvider
{
    public const PRICE_GROUP_ID = 'price-group-id';

    public function __construct(
        private RequestContextManager $requestContextManager,
        private string $defaultPriceGroupId,
    ) {
    }

    public function getCurrentPriceGroupId(): ?string
    {
        return $this->requestContextManager->getContextByHeader(self::PRICE_GROUP_ID) ?? $this->defaultPriceGroupId;
    }
}
