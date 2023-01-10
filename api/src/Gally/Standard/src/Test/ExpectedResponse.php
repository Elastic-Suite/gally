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

namespace Gally\Test;

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
