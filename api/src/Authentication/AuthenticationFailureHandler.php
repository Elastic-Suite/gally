<?php

declare(strict_types=1);

namespace App\Authentication;

use Gally\Configuration\Service\ConfigurationManager;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function __construct(private ConfigurationManager $configurationManager)
    {
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        // Redirect to the front application with an error message
        $baseUrl = $this->configurationManager->getScopedConfigValue('gally.base_url.front');

        return new RedirectResponse(\sprintf('%s/login?error=%s', $baseUrl, rawurlencode($exception->getMessage())));
    }
}
