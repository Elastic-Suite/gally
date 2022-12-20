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

namespace Elasticsuite\RequestContext\Service;

use Symfony\Component\HttpFoundation\RequestStack;

class RequestContextManager
{
    public function __construct(
        private RequestStack $requestStack,
        private array $requestContextConfig,
    ) {
    }

    public function getHeaders(): array
    {
        return $this->requestContextConfig['headers'] ?? [];
    }

    public function getContext(): array
    {
        $context = [];
        $request = $this->requestStack->getCurrentRequest();
        foreach ($this->getHeaders() as $header) {
            if (null != $request->headers->get($header)) {
                $context[$header] = $request->headers->get($header);
            }
        }

        return $context;
    }

    public function getContextByHeader(string $header): mixed
    {
        return $this->getContext()[$header] ?? null;
    }
}
