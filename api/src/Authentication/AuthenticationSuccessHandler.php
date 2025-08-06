<?php

declare(strict_types=1);

namespace App\Authentication;

use Gally\Configuration\Service\ConfigurationManager;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    public function __construct(
        private ConfigurationManager $configurationManager,
        private JWTTokenManagerInterface $jwtManager,
    ) {
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): ?Response
    {
        // Generate a token
        $user = $token->getUser();
        $token = $this->jwtManager->create($user);

        // Redirect to the front application with the token
        $baseUrl = $this->configurationManager->getScopedConfigValue('gally.base_url.front');

        return new RedirectResponse(\sprintf('%s/login?token=%s', $baseUrl, rawurlencode($token)));
    }
}
