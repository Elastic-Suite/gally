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

namespace Elasticsuite\Test;

/**
 * @codeCoverageIgnore
 */
class ExpectedResponse
{
    private ?\Closure $validateResponseCallback;

    public function __construct(
        private int $responseCode,
        ?callable $validateResponseCallback = null,
        private ?string $message = null,
        private bool $isValidateErrorResponse = false
    ) {
        $this->validateResponseCallback = $validateResponseCallback
            ? $validateResponseCallback(...)
            : null;
    }

    public function getValidateResponseCallback(): ?callable
    {
        return $this->validateResponseCallback;
    }

    public function getResponseCode(): int
    {
        return $this->responseCode;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function isValidateErrorResponse(): bool
    {
        return $this->isValidateErrorResponse;
    }
}
