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

namespace Gally\Entity\Service;

use Gally\RequestContext\Service\RequestContextManager;

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
